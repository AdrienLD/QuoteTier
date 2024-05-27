'use client'

import { use, useEffect, useState } from "react";
import Image from "next/image";

import { GETuserInfos, POSTsearchQuotes, login, validateQuote, DELETEQuote, POSTLikeQuote, POSTDislikeQuote, PUTCitation } from "../../APICalls";
import { GETsearchQuotes } from "../../APICalls";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function Home() {
  const [citation, setCitation] = useState('');
  const [auteur, setAuteur] = useState('');
  const [year, setYear] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [addNewQuote, setAddNewQuote] = useState(false);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState<{ name: string }|null>(null);
  const [toModify, setToModify] = useState<number|undefined>(undefined);
  const listeTri = ['Date croi', 'Date de', 'Popularité croi', 'Popularité de']
  const [tri, setTri] = useState(listeTri[0]);

  const createQuote = async () => {
    const body = { citation, auteur, annee: year }
    const reussite = await POSTsearchQuotes(body);

    if (reussite.success) {
      console.log(reussite.quotes);
      setAddNewQuote(false);
      setCitation('');
      setAuteur('');
      setYear('');
      refreshQuotes();
    } else {
      console.log(reussite.message);
    }
  }
  const [quotes, setQuotes] = useState<{ citation: string, auteur: string, annee:number, id:number, verifie: boolean, likes: number, dislikes: number
  }[]>([]);

  const refreshQuotes = async () => {
    GETsearchQuotes(search, tri).then((response) => {setQuotes(response.quotes)});
  }

  useEffect(() => {
    refreshQuotes()
  }, [search, tri])

  useEffect(() => {
    askUserInfo();
  })

  const changeQuote = async (id: number) => {
    await validateQuote(id);
    refreshQuotes();
  }

  const deleteQuote = async (id: number) => {
    await DELETEQuote(id);
    refreshQuotes();
  }

  const isConnected = () => {
    return localStorage.getItem('token') ?? false;
  }

  const askUserInfo = async () => {
    const connstion = await isConnected();
    if (!connstion) {
      setUser(null);
      return 
    }
    const response = await GETuserInfos(connstion)
    setUser(response.quotes.user);
  }

  const connection = async () => {
    try {
      const body = { username, password };
      const response = await login(body);
  
      if (response.success) {
        localStorage.setItem('token', response.quotes.userId); // Assurez-vous que le token est celui attendu.
      } else {
        console.error('Échec de la connexion:', response.message);
        alert('Échec de la connexion: ' + response.message); // Informer l'utilisateur.
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      alert('Erreur de connexion. Veuillez réessayer plus tard.'); // Informer l'utilisateur d'une erreur réseau ou serveur.
    }
    askUserInfo();
  }

  const addLike = async (id: number) => {
    await POSTLikeQuote(id);
    refreshQuotes();
  }

  const addDislike = async (id: number) => {
    await POSTDislikeQuote(id);
    refreshQuotes();
  }

  const modifyQuote = async () => {
    toModify !== undefined &&
    await PUTCitation(toModify, {citation, auteur, annee: year})
    setToModify(undefined);
    refreshQuotes();
  }

  const setQuoteInfoTo0 = () => {
    setToModify(undefined);
    setCitation('');
    setAuteur('');
    setYear('');
  }

  return (
    <main className="flex min-h-screen flex-col">

      <header className="w-full flex flex-row fixed p-6 bg-gradient-to-b from-white to-transparent backdrop-blur z-15">
      <Select  onValueChange={(newValue) => setTri(newValue)}>
  <SelectTrigger className="w-[300px] mr-4">
    <SelectValue placeholder="Trier par : " />
  </SelectTrigger>
  <SelectContent>
  {listeTri.map((trier) => (
    <SelectItem value={trier} key={trier}>
      {trier.includes('croi') ? (
        <div className="flex items-center">
          {trier.replace('croi', '')}
          <Image src="/croissant.png" alt="Croissant" className="h-5 mr-2" width={40} height={200}/>
        </div>
      ) : trier.includes('de') ? (
        <div className="flex items-center">
          {trier.replace('de', '')}
          <Image src="/croissant.png" alt="Décroissant" className="h-5 mr-2 rotate-180"  width={40} height={100}/>
        </div>
      ) : (
        trier
      )}
    </SelectItem>
  ))}
</SelectContent>

</Select>
        <Input className="w-full" placeholder="Rechercher" value={search} onChange={(e) => setSearch(e.target.value)}/>
        <Popover open={addNewQuote} >
          <PopoverTrigger className="w-1/2 " onClick={() => {setAddNewQuote(!addNewQuote); setQuoteInfoTo0()}}>Ajouter une citation</PopoverTrigger>
          <PopoverContent className="w-screen space-y-4 items-center justify-between ">
            <Textarea 
              value={citation}
              onChange={(e) => setCitation(e.target.value)}
              placeholder="Citation"/>
            <Input
              value={auteur}
              onChange={(e) => setAuteur(e.target.value)}
              placeholder="Auteur" />
            <Input 
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Year" />
            <Button onClick={createQuote}>Ajouter</Button>
          </PopoverContent>
        </Popover>
        <Dialog>
          <DialogTrigger>{ user === null ? 'Connection' : `Connecté` }</DialogTrigger>
          <DialogContent>
            {
              user === null ? <DialogHeader>
              <DialogTitle>Connection</DialogTitle>
              <DialogDescription>
              <Input 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nom d'utilisateur" />
              <Input 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de Passe" />
              <Button onClick={connection}>Connection</Button>
              </DialogDescription>
            </DialogHeader> : <DialogHeader>
              <DialogTitle>Vous êtes connecté</DialogTitle>
              <DialogDescription>
              Bonjour, {user.name}
              <Button onClick={() => {localStorage.removeItem('token'); askUserInfo()}}>Déconnection</Button>
              </DialogDescription>
            </DialogHeader>
            }
            
          </DialogContent>
        </Dialog>
      </header>
      <div className="mt-12 p-6">
        {
          quotes.map((quote) => (
            <Card key={quote.id} className="w-full h-full mt-8 flex">
              <CardHeader className="w-[96%]">
                <div className="flex  items-center ">
                  {
                    quote.verifie ? <Image 
                      src='/verified.svg' 
                      alt='vérifié'
                      width={30}  // Spécifiez la largeur de l'image
                      height={100}
                      className="mr-1"
                    /> : ''
                  }
                  <CardTitle>{toModify === quote.id ? <Input className="w-full" value={citation} onChange={(e) => setCitation(e.target.value)} /> : quote.citation}</CardTitle>
                </div>
                <CardDescription>{toModify === quote.id ? <Input value={auteur} onChange={(e) => setAuteur(e.target.value)} /> : quote.auteur} - {toModify === quote.id ? <Input value={year} onChange={(e) => setYear(e.target.value)} /> : quote.annee}</CardDescription>
                {toModify === quote.id ? <Button onClick={modifyQuote}>Valider</Button> : ''}
              </CardHeader>

              <CardContent className="relative z-0 m-1">
                  <div className="absolute inset-0 flex items-center justify-center z-0 m-2 cursor-pointer" onClick={() => addLike(quote.id)}>
                    <Image 
                      src='/bubble.png' 
                      alt="bubble"
                      width={70}  // Spécifiez la largeur de l'image
                      height={100}
                      className="absolute z-0"
                    />
                    <Image 
                      src='/like.png'
                      alt='edit'
                      width={25}  // Spécifiez la largeur de l'image
                      height={100}
                      className="absolute z-0"
                    />
                  </div>
                {quote.likes}
                </CardContent>
                <CardContent className="relative z-0 ml-4 m-1">
                  <div className="absolute inset-0 flex items-center justify-center m-2 cursor-pointer" onClick={() => addDislike(quote.id)}>
                    <Image 
                      src='/bubble.png' 
                      alt="bubble"
                      width={70}  // Spécifiez la largeur de l'image
                      height={100}
                      className="absolute z-0"
                    />
                    <Image 
                      src='/dislike.png'
                      alt='edit'
                      width={25}  // Spécifiez la largeur de l'image
                      height={100}
                      className="absolute z-0"
                    />
                  </div>
                  {quote.dislikes}
                </CardContent>
              {
                user !== null && user.name === 'admin' &&
                <DropdownMenu>
              <DropdownMenuTrigger className="px-6 z-0">
                <CardContent className="relative z-0">
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    <Image 
                      src='/bubble.png' 
                      alt="bubble"
                      width={70}  // Spécifiez la largeur de l'image
                      height={100}
                      className="absolute z-0"
                    />
                    <Image 
                      src='edit.svg'
                      alt='edit'
                      width={25}  // Spécifiez la largeur de l'image
                      height={100}
                      className="absolute z-0"
                    />
                  </div>
                </CardContent>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => changeQuote(quote.id)}>Valider</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {setToModify(quote.id); setCitation(quote.citation); setAuteur(quote.auteur); setYear(quote.annee.toString())}}>Modifier</DropdownMenuItem>
                <DropdownMenuItem onClick={() => deleteQuote(quote.id)}>Supprimer</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
              }
              
              
            </Card>
          ))
        }
      </div>
      
    </main>
  );
}
