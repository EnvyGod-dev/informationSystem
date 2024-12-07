package conf

import (
	"errors"
	"fmt"
	"net/url"
	"os"

	"gopkg.in/yaml.v3"
)

type Database struct {
	Parsed   *url.URL
	Driver   string `yaml:"driver"`
	Url      string `yaml:"url"`
	Password string `yaml:"password"`
}

type Migration struct {
	Dir string `yaml:"dir"`
}

type Rsa struct {
	Public  string `yaml:"public"`
	Private string `yaml:"private"`
	Size    int    `yaml:"size"`
}

type Config struct {
	Database  Database  `yaml:"database"`
	Migration Migration `yaml:"migration"`
	Rsa       Rsa       `yaml:"rsa"`
}

func (c *Config) Validate() error {
	if c.Database.Url == "" {
		return errors.New("unable to find database url configuration")
	}

	encodedPassword := url.QueryEscape(c.Database.Password)

	curl := fmt.Sprintf(c.Database.Url, encodedPassword)

	c.Database.Url = curl

	return nil
}

func CreateConfig(c *Config) error {
	path := "conf/conf_development.yml"

	if _, err := os.Stat(path); os.IsNotExist(err) {
		return err
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}

	err = yaml.Unmarshal(data, c)
	if err != nil {
		return err
	}

	return nil
}
