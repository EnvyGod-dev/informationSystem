package secure

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"errors"
	"math/big"
	"os"

	"namuunzul/conf"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
)

var (
	ErrKeyMustBePEMEncoded = errors.New("invalid Key: Key must be a PEM encoded PKCS1 or PKCS8 key")
	ErrNotRSAPrivateKey    = errors.New("key is not a valid RSA private key")
	ErrNotRSAPublicKey     = errors.New("key is not a valid RSA public key")
	ErrMissingKeyPair      = errors.New("missing key pair")
)

var (
	// RSA key pairs are nil unless declared in a global scope.
	k1 *rsa.PrivateKey = nil
	k2 *rsa.PublicKey  = nil
)

// If an asymmetric signature scheme i.e., RSA256 (RSA2048 + SHA256) used,
// then validating client must have access to the public key.
// If symmetric signature scheme i.e., HS256 (HMAC + SHA256) used,
// then validating client must have access to the secret key.
type RsaKey struct {
	c    *conf.Config
	Algo string
}

func NewRsaKey(c *conf.Config) *RsaKey {
	return &RsaKey{
		Algo: "RS512",
		c:    c,
	}
}

func (r *RsaKey) GetK1() *rsa.PrivateKey {
	return k1
}

func (r *RsaKey) GetK2() *rsa.PublicKey {
	return k2
}

// Generates RSA-2048 (617 decimal digits and 2048 bits) public and private key pair.
// RSA-2048 provides security strength of 112 bits, and is believed to be secure until 2030.
// NIST: SP 800-57, Part 1 includes a transition to a security strength of 128 bits in 2030;
// in some cases, the transition would be addressed by an increase in key sizes.
func (r *RsaKey) GenerateKeyPair(bits int) error {
	reader := rand.Reader

	temp, err := rsa.GenerateKey(reader, bits)
	if err != nil {
		return err
	}

	// Keep the reference to global variable.
	k1 = temp
	k2 = &k1.PublicKey

	return nil
}

func (r *RsaKey) SaveKeyPair() error {
	if err := saveK1(r.c.Rsa.Private, k1); err != nil {
		return err
	}

	if err := saveK2(r.c.Rsa.Public, k2); err != nil {
		return err
	}

	return nil
}

func saveK1(fn string, key *rsa.PrivateKey) error {
	of, err := os.Create(fn)
	if err != nil {
		return err
	}

	defer of.Close()

	data := &pem.Block{
		Type:  "RSA PRIVATE KEY",
		Bytes: x509.MarshalPKCS1PrivateKey(key),
	}

	err = pem.Encode(of, data)
	if err != nil {
		return err
	}

	return nil
}

func saveK2(fn string, key *rsa.PublicKey) error {
	of, err := os.Create(fn)
	if err != nil {
		return err
	}

	defer of.Close()

	data := &pem.Block{
		Type:  "RSA PUBLIC KEY",
		Bytes: x509.MarshalPKCS1PublicKey(key),
	}

	err = pem.Encode(of, data)
	if err != nil {
		return err
	}

	return nil
}

func (r RsaKey) ReadKeyPair() error {
	var err error

	k1, err = readK1(r.c.Rsa.Private)
	if err != nil {
		return err
	}

	k2, err = readK2(r.c.Rsa.Public)
	if err != nil {
		return err
	}

	if k1 == nil || k2 == nil {
		return ErrMissingKeyPair
	}

	return nil
}

func readK1(fn string) (*rsa.PrivateKey, error) {
	key, err := os.ReadFile(fn)
	if err != nil {
		return nil, err
	}

	var block *pem.Block
	if block, _ = pem.Decode(key); block == nil {
		return nil, ErrKeyMustBePEMEncoded
	}

	var parsed interface{}
	if parsed, err = x509.ParsePKCS1PrivateKey(block.Bytes); err != nil {
		if parsed, err = x509.ParsePKCS8PrivateKey(block.Bytes); err != nil {
			return nil, err
		}
	}

	var pkey *rsa.PrivateKey
	var ok bool
	if pkey, ok = parsed.(*rsa.PrivateKey); !ok {
		return nil, ErrNotRSAPrivateKey
	}

	return pkey, nil
}

func readK2(fn string) (*rsa.PublicKey, error) {
	key, err := os.ReadFile(fn)
	if err != nil {
		return nil, err
	}

	// Parse PEM block
	var block *pem.Block
	if block, _ = pem.Decode(key); block == nil {
		return nil, ErrKeyMustBePEMEncoded
	}

	// Parse the key
	var parsed interface{}
	if parsed, err = x509.ParsePKCS1PublicKey(block.Bytes); err != nil {
		if cert, err := x509.ParseCertificate(block.Bytes); err == nil {
			parsed = cert.PublicKey
		} else {
			return nil, err
		}
	}

	var pkey *rsa.PublicKey
	var ok bool
	if pkey, ok = parsed.(*rsa.PublicKey); !ok {
		return nil, ErrNotRSAPublicKey
	}

	return pkey, nil
}

func GenerateIteration(min, max int) (int, error) {
	randomValue, err := rand.Int(rand.Reader, big.NewInt(int64(max-min+1)))
	if err != nil {
		return 0, err
	}
	return int(randomValue.Int64()) + min, nil
}

func GetCurrentUserID(ctx *fiber.Ctx) (int32, error) {
	user := ctx.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID, ok := claims["user_id"].(float64)
	if !ok {
		return 0, errors.New("user_id not found in token")
	}
	return int32(userID), nil
}
