package secure

import (
	"encoding/json"
	"errors"
	"io"
	"time"

	"github.com/golang-jwt/jwt"
)

const (
	TokenSeconds = 18000
)

var ErrIncorrectJWTStructure = errors.New("incorrect JWT structure")

type Payload struct {
	jwt.StandardClaims
	AdminId      int32 `json:"adminId"`
	IsAdmin      bool  `json:"is_admin"`
	IsSuperAdmin bool  `json:"is_super_admin"`
}

// Types can have associated functions which are equivalent of C# extensions.
func (pl *Payload) FromJSON(s string) error {
	return json.Unmarshal([]byte(s), pl)
}

// Encapsulates the JSON to IO writer logic, read more at
// https://pkg.go.dev/encoding/json#Encoder.Encode
func (pl *Payload) ToJSON(w io.Writer) error {
	e := json.NewEncoder(w)
	return e.Encode(pl)
}

// Generates a JWT using RS512 (RSA public key cryptography based) hashing algorithm.
// Includes custom claims in addition to the standard JWT claims.

func IssueToken(adminId int32, isAdmin, isSuperAdmin bool, kp *RsaKey) (string, error) {
	claims := Payload{
		StandardClaims: jwt.StandardClaims{
			IssuedAt: time.Now().Unix(),
			Issuer:   "orchid-auth-service",
		},
		AdminId:      adminId,
		IsAdmin:      isAdmin,
		IsSuperAdmin: isSuperAdmin,
	}

	// Token expires after defined period
	claims.StandardClaims.ExpiresAt = time.Now().UTC().Unix() + TokenSeconds

	// Get signing method and sign the token
	method := jwt.GetSigningMethod(kp.Algo)
	token := jwt.NewWithClaims(method, claims)

	stoken, err := token.SignedString(kp.GetK1())
	if err != nil {
		return "", err
	}

	return stoken, nil
}

// Computes signature, verifies the JWT authenticity, and returns the JWT payload.
// Additionally, checks if the user is an Admin or Super Admin.
func VerifyToken(tokenStr string, kp *RsaKey) (jwt.MapClaims, bool, bool, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return kp.GetK2(), nil
	})

	if err != nil {
		return nil, false, false, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, false, false, errors.New("invalid token")
	}

	// Check if the user is an admin
	isAdmin := false
	if adminVal, ok := claims["is_admin"].(bool); ok {
		isAdmin = adminVal
	}

	// Check if the user is a super admin
	isSuperAdmin := false
	if superAdminVal, ok := claims["is_super_admin"].(bool); ok {
		isSuperAdmin = superAdminVal
	}

	return claims, isAdmin, isSuperAdmin, nil
}
