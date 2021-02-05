class WKRegExp {

    /**
     * Remove all white space. For example, ' white space ' will be replace with 'whitespace'.
     * @param value: expected string type value
     * @returns {*}: new string without any white space
     */
    static trimWhiteSpace = (value) => {
        if (typeof value !== 'string') {
            __DEV__ && console.warn('Error type, expect a string type!');
            return value;
        }
        return value.replace(/\s+/g, '');
    };

    /**
     * Judge the password whether to consist of character and number.
     * @param password
     * @returns {boolean}
     */
    static verifyPassword = (password) => {
        if (!password) return false;
        let result = '';
        for (let i = 97; i < 123; i++) {
            result += String.fromCharCode(i);
        }
        for (let i = 0; i < 10; i++) {
            result += i;
        }
        password = password.toLocaleLowerCase();
        const passwords = Array.from(password);
        for (let i = 0; i < passwords.length; i++) {
            if (result.indexOf(passwords[i]) < 0) return false;
        }
        const regExp = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
        return regExp.test(password);
    };

    /**
     * Get string containing number only.
     * @param value: "test1234"
     * @returns {string}: "1234"
     */
    static onlyNumber = (value) => {
        if (typeof value !== 'string') return;
        return value.replace(/\D/g,'');
    };

}

export default WKRegExp;