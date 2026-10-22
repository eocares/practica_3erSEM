#!/bin/bash

# Detener el script si ocurre algún error
set -e

echo "=== 1. Creando directorio de llaves y descargando la clave GPG de Docker ==="
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "=== 2. Agregando el repositorio oficial de Docker a APT ==="
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

echo "=== 3. Actualizando el índice de paquetes ==="
sudo apt-get update

echo "=== 4. Instalando paquetes necesarios y Docker con sus componentes ==="
sudo apt-get install -y ca-certificates curl docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "=== 5. Verificando la instalación con el contenedor de prueba ==="
sudo docker run hello-world

echo "=== ¡Instalación de Docker completada con éxito! ==="

# Otórga permisos de ejecución:

# chmod +x install_docker.sh

# Ejecuta el script:

# ./install_docker.sh