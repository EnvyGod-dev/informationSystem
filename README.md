<h1 align="center">Мэдээллийн системийн хөгжүүлэлт</h1>


<p align="center">
    Системийн тухай
    </br>
</p>

<p align="center">
    Developer branch татах нь
    </br>
</p>

## HTTP config git бол
```sh
    git clone -b developer https://github.com/PsychicWorms/negunMobileFrontEnd.git
```

## SSH config git бол
```sh
    git clone -b developer git@github.com:PsychicWorms/negunMobileFrontEnd.git
```

<p align="center">
    master branch татах нь
    </br>
</p>

## HTTP config git бол
```sh
    git clone   https://github.com/PsychicWorms/negunMobileFrontEnd.git
```

## SSH config git бол
```sh
    git clone  git@github.com:PsychicWorms/negunMobileFrontEnd.git
```

## 📝 Агуулга

- [Систем](#about)
- [Шаардлага](#getting_started)
- ️[VSCode тохиргоо](#vscode)
- [Ажлуулах](#run)
- [Сервер](#deployment)
- [Ашигласан технологи](#built_using)

## 🧐 Систем <a name = "about"></a>


## 🏁 Шаардлага <a name = "getting_started"></a>

Үйлдлийн систем дээр дараах зүйлсийг суулгасан байх шаардлагатай.

> Linux болон macOS систем дээр суулгах зааврууд.

#### SQLC

Sqlc нь SQL-ээс golang код үүсгэхэд ашиглана.

<details>
<summary>sqlc суулгах</summary>

#### MacOS

```sh
brew install sqlc
```

#### Linux

```sh
go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest
```
</details>

#### Nodejs.org 

Эндээс nodejs-ийг татаж суулгана Front-End ажиллуулахад хэрэгтэй
<details>
<summary>nodejs суулгах</summary>

### Linux
```sh
sudo apt install nodejs
```


### MacOS
```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

brew install node
```


</details>



#### GOLANGCI-LINT

.go файлууд буюу golang lint.

<details>
<summary>golangci-lint суулгах</summary>

#### Linux

```sh
curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $(go env GOPATH)/bin v1.55.2
```

#### MacOS

```sh
brew install golangci-lint
```

</details>

## 🗒️ VSCode тохиргоо <a name = "vscode"></a>

Дараах тохиргоо нь vscode дотор golangci lint ашиглахад хэрэгтэй.

#### Settings.json

```json
"go.lintFlags": ["--fast"],
"go.lintTool": "golangci-lint",
```

#### Extensions

- [SQL Formatter](https://marketplace.visualstudio.com/items?itemName=adpyke.vscode-sql-formatter)

## 🔧 Ажлуулах <a name = "run"></a>

#### 1. Project- ийг ажлуулах command `conf-test.yml` файлийг ашиглан асна.

```
make run
```

#### 2.Conf.yml уншиж ажилуулна

```
project
    └── conf
          └── conf-development.yml
```

#### 2. SQL-ээс golang код үүсгэх command үүссэн `.go` файлууд `db/sqlc/` фолдор дотор үүснэ.

```
make sqlc
```

```
project
    └── db
         └── sqlc
               ├── file.sqlc.go
               ├── file.sqlc.go
               └── file.sqlc.go
```



## 🚀 Сервер <a name = "deployment"></a>

-  postgresql ассан байх шаардлагатай.

- CI/CD github self hosted action ашиглаж байгаа учир runner server дээр ажиллаж байх ёстой.

- Kubernetes server дээр Deployment болон Service-ийг yaml дээр бичэх болно.

## ⛏️ Ашигласан технологи <a name = "built_using"></a>

- [sqlc](https://github.com/sqlc-dev/sqlc)
- [golang-migrate](https://github.com/golang-migrate/migrate)
- [pgx](https://github.com/jackc/pgx)
- [nextjs](https://nextjs.org/)
- [MaterialUi](https://mui.com/)