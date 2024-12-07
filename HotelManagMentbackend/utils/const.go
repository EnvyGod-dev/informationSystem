package utils

const (
	// otp.
	ErrOtpCreate     = "OTP код үүсгэх үед алдаа гарлаа! "
	ErrOtpTryCount   = "Таны оролдлого дууссан байна. Хэсэг хугацааны дараа дахин оролдно уу!"
	ErrOtpWrong      = "OTP код буруу байна!" // #nosec G101
	ErrOtpExpired    = "OTP кодын хугацаа дууссан байна! "
	ErrOtpNotExpired = "OTP код илгээсэн байна."
	ErrOtpNotUsed    = "OTP кодыг ашиглах боломжгүй! "
	ErrOtpCheck      = "OTP кодыг шалгахад алдаа гарлаа!"

	// user.
	ErrUserAlready             = "бүртгэлтэй байна!"
	ErrNotUserAlready          = "бүртгэлгүй байна!"
	ErrUserPass                = "Нууц үг шаардлага хангахгүй байна!" // #nosec G101
	ErrUserInActive            = "Хэрэглэгч идэвхигүй байна! "
	ErrUserNotAdmin            = "Хэрэглэгч админ биш байна! "
	ErrUserBlock               = "Хэрэглэгч блоклогдсон байна. %v минут %v секундын дараа дахин оролдоно уу."
	ErrUserBlocked             = "Хэрэглэгч %v минут блоклогдлоо! "
	ErrPassIncorrectAndAttempt = "Таны нууц үг буруу байна. Танд %v удаагийн оролдлого үлдлээ." // #nosec G101
	ErrNotOldPass              = "нууц үг буруу байна."                                         // #nosec G101
	ErrNotNewEmail             = "Бүртгэлтэй email байна"

	// auth.
	ErrInvalidAuth = "эрх алдаатай байна"
	ErrExpiredAuth = "Token-ий хугацаа дууссан байна!"

	// file.
	ErrFileNameDup = "файлын нэр давхцаж байна"
	BucketName     = "orchidink"

	// lang.
	ErrNotFoundLang = "Хэл сонгоогүй байна"

	// wechat.
	NotifWeChat    = "Wechat мэдээлэл"
	NotifWeChatSpc = "Wechat онцгой болгох"

	// factory.
	NotifFactorySpc = "Үйлдвэр онцгой болгох"

	// hotel.
	NotifHotelSpc = "Буудал онцгой болгох"

	// translator.
	ErrTranslatorAlreadyExist = "Орчуулагчаар бүртгүүлсэн байна"
	ErrTranslatorNotUpdate    = "Орчуулагч засах боломжгүй байна"
	NotifTranslatorInfo       = "Орчуулагчийн мэдээлэл"
	NotifTranslatorSpc        = "Орчуулагч онцгой болгох"

	// data.
	ErrConvertData = "Буруу мэдээлэлэл байна хөрвүүлэлт алдаа"

	// price.
	ErrNotPaid = "Төлбөр төлөгдөөгүй байна"

	// txn decs.
	SpcWechatTxnDesc        = "WeChat онцгой зар"
	SpcHotelTxnDesc         = "Буудал онцгой зар"
	SpcTranslatortTxnDesc   = "Орчуулагч онцгой зар"
	SpcFactoryTxnDesc       = "Үйлдвэр онцгой зар"
	RsrHotelResearchTxnDesc = "буудал судлуулах"
	InfWechatTxnDesc        = "WeChat мэдээлэл"
	InfTranslatorTxnDesc    = "Орчуулагч мэдээлэл"
)
