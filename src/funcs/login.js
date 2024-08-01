import puppeteer from 'puppeteer'
import { USER_SESSION_PATH } from '../config/constants.js'
import * as fs from 'node:fs'

class LoginForm {
  constructor(page) {
    this.page = page
  }

  identifiers = {
    loginInput: '#identifierId',
    loginBtn: '#identifierNext > div > button',
    passwordInput: 'input[name="Passwd"]',
    passwordBtn: '#passwordNext > div > button',
  }

  elements = {
    loginInput: () => this.page.locator(this.identifiers.loginInput),
    loginBtn: () => this.page.locator(this.identifiers.loginBtn),
    passwordInput: () => this.page.locator(this.identifiers.passwordInput),
    passwordBtn: () => this.page.locator(this.identifiers.passwordBtn),
  }

  async fillLogin(login) {
    await this.elements.loginInput().fill(login)
  }

  async clickLoginBtn() {
    await this.elements.loginBtn().click()
  }

  async fillPassword(password) {
    await this.elements.passwordInput().fill(password)
  }

  async clickPasswordBtn() {
    await this.elements.passwordBtn().click()
  }
}

async function login(page, login, password) {
  return new Promise(async (resolve, reject) => {
    try {
      console.group('- Login')
      console.log('-------------')
      console.time('- Login time')
      console.log('> Trying to login...')

      console.log('> Waiting for login page...')

      const form = new LoginForm(page)

      await page.waitForSelector(form.identifiers.loginInput, {
        visible: true,
      })

      console.log('> Filling the email')
      await form.fillLogin(login)
      await form.clickLoginBtn()

      await page.waitForSelector(form.identifiers.passwordInput, {
        visible: true,
      })
      console.log('> Filling the password')
      await form.fillPassword(password)

      console.time('> Waiting for login response')
      await form.clickPasswordBtn()
      console.timeEnd('> Waiting for login response')

      console.log('> User successfully logged in')

      resolve()
    } catch (error) {
      console.error(`> Error at login: ${error.message}`)
      reject(error)
    } finally {
      console.log('-------------')
      console.groupEnd('Login')
      console.timeEnd('- Login time')
    }
  })
}

export { login }
