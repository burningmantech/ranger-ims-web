## Trusting the CA

Modified from [Lando's security docs](https://github.com/lando/core/blob/main/docs/security.md)

Trusting the Caddy CA on your host machine will alleviate browser warnings regarding certs.

Note that in accordance with the [restrictions](https://en.wikipedia.org/wiki/Wildcard_certificate#Limitations) on wildcard certs, changing the `domain` may result in unexpected behavior depending on how you set it. For example, setting `domain` to a top level domain such as `test` will not work while `local.test` will.

### macOS (see Firefox instructions below)

```bash
# Add the Caddy CA
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ./certs/container_id.pem

# Remove Caddy CA
sudo security delete-certificate -c "Lando Local CA"
```

### Windows

```bash
# Add the Caddy CA
certutil -addstore -f "ROOT" C:\Users\ME\.lando\certs\container_id.pem

# Remove Caddy CA
certutil -delstore "ROOT" serial-number-hex
```

### Debian

```bash
# Add the Caddy CA
sudo cp -r ./certs/container_id.pem /usr/local/share/ca-certificates/container_id.pem
sudo cp -r ./certs/container_id.crt /usr/local/share/ca-certificates/container_id.crt
sudo update-ca-certificates

# Remove Caddy CA
sudo rm -f /usr/local/share/ca-certificates/container_id.pem
sudo rm -f /usr/local/share/ca-certificates/container_id.crt
sudo update-ca-certificates --fresh
```

### Ubuntu or MacOS with Firefox

Import the `./certs/container_id.pem` CA certificate in Firefox by going to `about:preferences#privacy` > `View Certificates` > `Authorities` > `Import`, enabling **Trust this CA to identify websites.**.

### Ubuntu with Chrome

On the Authorities tab at chrome://settings/certificates, import `./certs/container_id.pem or /usr/local/share/ca-certificates/container_id.crt`

### Arch

```bash
# Add the Caddy CA
sudo trust anchor ./certs/container_id.pem
sudo trust anchor ./certs/container_id.crt

# Remove Caddy CA
sudo trust anchor --remove ./certs/container_id.pem
sudo trust anchor --remove ./certs/container_id.crt
```

::: warning Firefox and FF variants maintain their own certificate stores!
Firefox users may still see browser warnings after performing the steps above. Firefox maintains its own certificate store and does not, by default, use the operating system's certificate store. To allow Firefox to use the operating system's certificate store, the **security.enterprise_roots.enabled** setting must be set to **true**.

- In Firefox, type `about:config` in the address bar
- If prompted, accept any warnings
- Search for `security.enterprise_roots.enabled`
- Set the value to `true`
  :::
