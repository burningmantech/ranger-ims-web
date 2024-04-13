#!/bin/sh

caddy_id=$(docker compose ps | grep caddy | awk '{print $1;}')

if [ -z "$caddy_id" ]; then
  echo "Starting caddy"
  docker compose up -d caddy
  caddy_id=$(docker compose ps | grep caddy | awk '{print $1;}')
fi
echo "Caddy container ID $caddy_id"

host_os=$(uname -s)

if [ "$host_os" == "Linux" ]; then
  echo "Linux host Caddy trust removal..."

  echo "Removing cert contents from /usr/share/ca-certificates/caddy/$caddy_id.pem"
  sudo rm "/usr/share/ca-certificates/caddy/$caddy_id.pem"

  # echo "Rmoving caddy/$caddy_id.pem from /etc/ca-certificates.conf"
  # sudo sed -i "caddy/$caddy_id.pem" /etc/ca-certificates.conf

  echo "Trying update-ca-certificates"
  sudo update-ca-certificates
  if [ $? -ne 0 ]; then
    echo "Trying update-ca-trust since update-ca-certificates didn't work"
    sudo update-ca-trust
  fi

elif [ "$host_os" == "Darwin" ]; then
  echo "MacOS host Caddy trust removal..."

  # TODO
fi

echo "Stopping caddy"
docker compose stop caddy
