require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Our routes go here:


// GET route home
app.get("/", (req, res) => {
    res.render("index");
})

//GET search bar ROUTE
app.get("/artist-search", (req, res) =>  {
  spotifyApi
    .searchArtists(req.query.artistName)
    .then(data => {
        console.log('The received data from the API:', data.body.artists.items);
        const foundArtists = data.body.artists.items;
       
        res.render("artist-search-result", {data: foundArtists })
    })
    
    .catch(err => console.log("Error while searching artists", err));
    
})


app.get("/albums/:artistId", (req, res, next) => {
    const artistId = req.params.artistId;
    spotifyApi.getArtistAlbums(artistId)
        .then(data => {
            //const allAlbums = data.body.artists;
            console.log("data", data.body.items);
            const albums = data.body.items;
            res.render("albums", {data: albums })
        })
})


//getting the tracks - iteration 5

/*app.get("/albums/tracks/:artistId" , (req, res) => {

    spotifyApi.getAlbumTracks()
    .then(data => {
        
    })
})





app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
