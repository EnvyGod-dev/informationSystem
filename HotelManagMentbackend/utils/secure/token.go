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
	Role        string `json:"role"`
	UserId      int32  `json:"user_id"`      // Хэрэглэгчийн ID
	IsAdmin     bool   `json:"is_admin"`     // Админ эрхтэй эсэх
	IsUser      bool   `json:"is_user"`      // Хэрэглэгч эрхтэй эсэх
	IsReception bool   `json:"is_reception"` // Receptionist эрхтэй эсэх
	IsFinance   bool   `json:"is_finance"`   // Finance эрхтэй эсэх
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

func IssueToken(UserId int32, isAdmin, isUser, isReception, isFinance bool, kp *RsaKey) (string, error) {
	claims := Payload{ // Токенд агуулагдах мэдээлэл
		StandardClaims: jwt.StandardClaims{
			IssuedAt:  time.Now().Unix(),                      // Токен үүсгэсэн цаг
			Issuer:    "hotel-management-service",             // Токены үүсгэсэн систем
			ExpiresAt: time.Now().UTC().Unix() + TokenSeconds, // Токен дуусах хугацаа
		},
		UserId:      UserId,      // Хэрэглэгчийн ID
		IsAdmin:     isAdmin,     // Админ эрхтэй эсэх
		IsUser:      isUser,      // Хэрэглэгч эрхтэй эсэх
		IsReception: isReception, // Receptionist эрхтэй эсэх
		IsFinance:   isFinance,   // Finance эрхтэй эсэх

	}

	method := jwt.GetSigningMethod(kp.Algo)       // Алгоритмыг сонгох (RS512)
	token := jwt.NewWithClaims(method, claims)    // JWT токен үүсгэх
	stoken, err := token.SignedString(kp.GetK1()) // Private Key ашиглан гарын үсэг зурж токен үүсгэх
	if err != nil {
		return "", err
	}

	return stoken, nil // Үүссэн токен буцаах
}

// Computes signature, verifies the JWT authenticity, and returns the JWT payload.
// Additionally, checks if the user is an Admin or Super Admin.
func VerifyToken(tokenStr string, kp *RsaKey) (*Payload, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &Payload{}, func(token *jwt.Token) (interface{}, error) {
		if kp == nil || kp.GetK2() == nil {
			return nil, errors.New("RSA public key not provided")
		}

		// Алгоритмыг шалгах
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, errors.New("unexpected signing method")
		}

		return kp.GetK2(), nil
	})

	if err != nil || !token.Valid {
		return nil, errors.New("invalid token")
	}

	claims, ok := token.Claims.(*Payload)
	if !ok {
		return nil, errors.New("invalid token claims")
	}

	return claims, nil
}
