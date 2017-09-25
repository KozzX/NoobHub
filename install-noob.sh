echo Atualizando repositórios..

cd ~;
curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh;
sudo bash nodesource_setup.sh;
sudo apt-get install nodejs;
sudo apt-get install build-essential;
git clone https://github.com/KozzX/NoobHub/;
sudo npm install -g pm2;
pm2 start NoobHub/server/node.js;
pm2 monit;
