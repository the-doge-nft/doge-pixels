import {i18n} from "@lingui/core";
import {I18n} from "@lingui/core/cjs/i18n";
import {messages as EnglishMessages} from "../locales/en/messages";
import LocalStorage from "./local-storage";

export type LocaleName = "en"

const LS_LOCALE_KEY = "locale"

class LocaleClass {
    i18n: I18n

    defaultLocale: LocaleName = "en"

    messageToLocaleMap = {
        "en": EnglishMessages,
    }

    constructor() {
        this.i18n = i18n
    }

    init() {
        this.locale = this.locale
    }

    set locale(locale: LocaleName) {
        this.i18n.load(locale, this.messageToLocaleMap[locale])
        this.i18n.activate(locale)
        LocalStorage.setItem(LS_LOCALE_KEY, locale)
    }

    get locale() {
        return LocalStorage.getItem(LS_LOCALE_KEY, LocalStorage.PARSE_STRING, this.defaultLocale)
    }
}

const Locale = new LocaleClass()
Locale.init()

export default Locale

