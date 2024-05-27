const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());


// Route pour récupérer toutes les citations
app.get('/citations', async (req, res) => {
  const search = req.query.search ?? undefined;
  const tri = req.query.tri ?? undefined;
  console.log(tri);
  let order = {};
  switch(tri) {
    case 'Date croi':
      order = { createdAt: 'asc' };  // Tri par date croissante
      break;
    case 'Date de':
      order = { createdAt: 'desc' };  // Tri par date décroissante
      break;
    case 'Popularité croi':
      order = { likes: 'asc' };  // Tri par popularité croissante
      break;
    case 'Popularité de':
      order = { likes: 'desc' };  // Tri par popularité décroissante
      break;
    default:
      order = { id: 'asc' };  // Tri par défaut (par exemple, par ID croissant)
  }

  let citations;
  if (search) {
    citations = await prisma.citation.findMany({
      where: {
        OR: [
          { citation: { contains: search } },
          { auteur: { contains: search } }
        ]
      },
      orderBy: order
    })
  } else {
    citations = await prisma.citation.findMany({ orderBy: order })
  }
  res.json(citations.reverse());
});

// Route pour ajouter une nouvelle citation
app.post('/citations', async (req, res) => {
  const { citation, auteur, annee } = req.query;
  console.log(citation, auteur, annee);
  const nouvelleCitation = await prisma.citation.create({
    data: { citation, auteur, annee: parseInt(annee)},
    
  });
  res.json(nouvelleCitation);
});

// Route pour modifier la validation d'une citation
app.patch('/citations/:id', async (req, res) => {
  const { id } = req.params;
  const existingCitation = await prisma.citation.findUnique({
    where: { id: parseInt(id) }
  });
  const citation = await prisma.citation.update({
    where: { id: parseInt(id) },
    data: { verifie: !existingCitation.verifie }
  });
  res.json(citation);
});

app.delete('/citations/:id', async (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  try {
    await prisma.citation.delete({
      where: { id: parsedId }
    });

    res.status(204).send();  // 204 No Content est souvent utilisé pour indiquer une suppression réussie
  } catch (error) {
    console.error("Erreur lors de la suppression de la citation :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

//Modifier une citation
app.put('/citations/:id', async (req, res) => {
  const { citation, auteur, annee} = req.body;
  const { id } = req.params;
  const updatedCitation = await prisma.citation.update({
    where: { id: parseInt(id) },
    data: { citation, auteur, annee: parseInt(annee) }
  });
  res.json(updatedCitation);

  
})

// Route pour ajouter un like à une citation
app.post('/citations/:id/like', async (req, res) => {
  const { id } = req.params;
  const citation = await prisma.citation.findUnique({
    where: { id: parseInt(id) }
  });
  const updatedCitation = await prisma.citation.update({
    where: { id: parseInt(id) },
    data: { likes: citation.likes + 1 }
  });
  res.json(updatedCitation);
});

// Route pour ajouter un dislike à une citation
app.post('/citations/:id/dislike', async (req, res) => {
  const { id } = req.params;
  const citation = await prisma.citation.findUnique({
    where: { id: parseInt(id) }
  });
  const updatedCitation = await prisma.citation.update({
    where: { id: parseInt(id) },
    data: { dislikes: citation.dislikes + 1 }
  });
  res.json(updatedCitation);
});


app.post('/login', async (req, res) => {
  const { username, password } = req.query;
  console.log(username, password);
  try {
    const user = await prisma.user.findUnique({
      where: {
        name: username
      }
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier le mot de passe
    const isMatch = password === user.password;
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    res.json({ message: "Connexion réussie!", userId: user.id })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/login/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId, 10)
      }
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: "Connexion réussie!", user: user})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
