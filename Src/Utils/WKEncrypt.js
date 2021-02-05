import forge from 'node-forge';

class WKEncrypt {

    static password(password) {
        let md = forge.md.md5.create();
        md.update(password + '@wanke');
        password = md.digest().toHex();
        return password;
    }

}

export default WKEncrypt;