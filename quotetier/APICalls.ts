export async function POSTsearchQuotes(body: { citation: string, auteur: string, annee: string }) {
    console.log(body);
    const response = await fetch(`http://localhost:4000/citations?citation=${body.citation}&auteur=${body.auteur}&annee=${body.annee}`,
        {
            method: 'POST'
        });

    const quotes = await response.json();
    if (!response.ok) {
        return { success: false, message: quotes }
    } 
    return { success: true, quotes}
}

export async function GETsearchQuotes(field: string, tri: string) {
    console.log(field, tri);
    const response = await fetch(`http://localhost:4000/citations?search=${field}&tri=${tri}`,
        {
            method: 'GET'
        });

    const quotes = await response.json();
    if (!response.ok) {
        return { success: false, message: quotes }
    } 
    return { success: true, quotes}
}

export async function validateQuote(id: number) {
    const response = await fetch(`http://localhost:4000/citations/${id}`,
        {
            method: 'PATCH'
        });

    const quotes = await response.json();
    if (!response.ok) {
        return { success: false, message: quotes }
    } 
    return { success: true, quotes}
}

export async function DELETEQuote(id: number) {
    await fetch(`http://localhost:4000/citations/${id}`,
        {
            method: 'DELETE'
        });
}

export async function login(body: { username: string, password: string }) {
    const response = await fetch(`http://localhost:4000/login?username=${body.username}&password=${body.password}`,
        {
            method: 'POST'
        });

    const quotes = await response.json();
    if (!response.ok) {
        return { success: false, message: quotes }
    } 
    return { success: true, quotes}
}

export async function GETuserInfos(userId: string){
    const response = await fetch(`http://localhost:4000/login/${userId}`,
        {
            method: 'GET'
        });

    const quotes = await response.json();
    if (!response.ok) {
        return { success: false, message: quotes }
    } 
    return { success: true, quotes}
}

export async function POSTLikeQuote(id: number) {
    const response = await fetch(`http://localhost:4000/citations/${id}/like`,
        {
            method: 'POST'
        });

    const quotes = await response.json();
    if (!response.ok) {
        return { success: false, message: quotes }
    } 
    return { success: true, quotes}
}


export async function POSTDislikeQuote(id: number) {
    const response = await fetch(`http://localhost:4000/citations/${id}/dislike`,
        {
            method: 'POST'
        });

    const quotes = await response.json();
    if (!response.ok) {
        return { success: false, message: quotes }
    } 
    return { success: true, quotes}
}

//Modify Citation
export async function PUTCitation(id: number, body: { citation: string, auteur: string, annee: string }) {
    console.log(body);
    console.log(JSON.stringify(body));
    const response = await fetch(`http://localhost:4000/citations/${id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

    const quotes = await response.json();
    if (!response.ok) {
        return { success: false, message: quotes }
    } 
    return { success: true, quotes}
}