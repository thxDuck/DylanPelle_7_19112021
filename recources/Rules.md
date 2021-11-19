# Cas d'utilisation de la recherche

## Regles

- La recherche doit pouvoir se faire via le champ principal ou via les tags (ingrédients, 
ustensiles ou appareil) 
- La recherche principale se lance à partir de 3 caractères entrés par l’utilisateur dans la 
barre de recherche
- La recherche s’actualise pour chaque nouveau caractère entré
- La recherche principale affiche les premiers résultats le plus rapidement possible (Donc affichage en cours de recherche)
- Les champs ​ingrédients​, ​ustensiles​ et appareil de la recherche avancée proposent 
seulement les éléments restant dans les recettes présentes sur la page (Doit rechercher PARMIS les elements des recettes déja présentes)
- Les retours de recherche doivent être une intersection des résultats. Si l’on ajoute les 
tags “coco” et “chocolat” dans les ingrédients, on doit récupérer les recettes qui ont à la 
fois de la coco et du chocolat. (ET exclusif)
