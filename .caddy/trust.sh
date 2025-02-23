#!/bin/sh

caddy_id=$(docker compose ps | grep caddy | awk '{print $1;}')

if [ -z "$caddy_id" ]; then
  echo "Starting caddy"
  docker compose up -d caddy
  caddy_id=$(docker compose ps | grep caddy | awk '{print $1;}')
fi
echo "Caddy container ID $caddy_id"

cert=$(mktemp)
cert_label="Caddy Local Authority - ECC Root CA"
docker exec -t "$caddy_id" cat /data/caddy/pki/authorities/local/root.crt > "$cert"

host_os=$(uname -s)

if [ "$host_os" == "Linux" ]; then
  echo "Linux host Caddy setup..."
  echo "Note: requires certutil & update-ca-certificates or update-ca-trust to be installed on host"

  echo "Creating /usr/share/ca-certificates/caddy directory if it doesn't exist"
  sudo mkdir -p /usr/share/ca-certificates/caddy

  echo "Copying cert contents to /usr/share/ca-certificates/caddy/$caddy_id.pem"
  sudo cp "$cert" "/usr/share/ca-certificates/caddy/$caddy_id.pem"

  echo "Adding caddy/$caddy_id.pem to /etc/ca-certificates.conf"
  echo "caddy/$caddy_id.pem" | sudo tee -a /etc/ca-certificates.conf

  echo "Trying update-ca-certificates"
  sudo update-ca-certificates
  if [ $? -ne 0 ]; then
    echo "Trying update-ca-trust since update-ca-certificates didn't work"
    sudo update-ca-trust
  fi

  echo "Finding all cert9 DBs in your home directory"
  for cert_db in $(find ~/ -name 'cert9.db' 2>/dev/null)
  do
    cert_db_dir=$(dirname "${cert_db}");

    echo "\
    Adding cert to $cert_db_dir with certutil"
    # echo "certutil -A -n \"${cert_label}\" -t \"TCu,Cu,Tu\" -i \"${cert}\" -d sql:\"${cert_db_dir}\""
    certutil -d "${cert_db_dir}" -A -n "${cert_label}" -t "TCu,Cu,Tu" -i "${cert}"
  done
elif [ "$host_os" == "Darwin" ]; then
  echo "MacOS host Caddy setup..."

  echo "Adding cert to System.keychain with security add-trusted-cert"
  sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain "$cert"
fi

echo "Cleaning up $cert"
rm "$cert"

echo "Stopping caddy"
docker compose stop caddy
