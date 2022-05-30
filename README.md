# Groupomania
Réseau social interne de Groupomania, entreprise spécialisée dans la grande distribution.
La version actuelle est une MVP (Minimum Viable Product).

## Installation
### 1- Prérequis
```
Pour installer ce projet, vous devez d'abord installer
- Node.js
- MySQL
- Vuejs 3
```
### 2- Cloner le repo du projet
```
Dans votre terminal éxécutez les commandes :
git clone https://github.com/AthenaRichard06/RichardAthena_7_27042022.git
cd RichardAthena_7_27042022
```
### 3- La base de données
```
1. Ouvrir la console MySQL et créer un compte ou se connecter si vous en avez déjà un
2. Créer une base de données nommée "groupomania"
3. Importer le fichier "Groupomania_base_données.sql"  qui se trouve à la racine du repo du projet
```
### 4- Installer le backend
```
1. Exécutez la commande => cd backend
2. Installer npm  => npm install
3. Créer un fichier .env et y renseigner les variables comme indiqué dans le fichier env-exemple
4. Ajouter une photo de profil par défaut dans un dossier "images", nommé "default-profile.jpg"
5. Lancer le serveur backend => npm start ou nodemon server (si nodemon est installé)
```
Il est important pour ce MVP (Minimum Viable Product) d'utiliser le port 3000.

### 5- Installer le frontend
```
1. Exécutez la commande => cd frontend
2. Installer npm  => npm install
3. Lancer le serveur frontend => npm run serve
```
### 6- Lancer l'application
```
Ouvrir l'application en cliquant sur "http://localhost:8080/"
```
## Technologies utilisées
Node, Vuejs, SQL (base des données)

## Fonctionnalités
### Authentification
Inscription
Connexion
Déconnexion
Désinscription
### Social
Affichage des publications de tou·tes les utilisateur·rices
Création de nouvelles publications
Modification de publications
Suppression de publications
Affichage d'un profil personnel
Modification d'un profil personnel
### Modération
Un compte administrateur·rice a été créé. Vous pouvez modifier les données par défaut après connexion :
```
#Informations de connexion de l'administrateur·rice
email: "administrateur@groupomania.fr"
mot de passe: "Admin_1234"
```
Modérer les contenus (modifier et supprimer les publications des utilisateur·rices)