import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiInfo } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import { useParams } from 'react-router-dom'
import L from 'leaflet';

import mapMarkerImg from '../images/map-marker.svg';
import Sidebar from "../components/Sidebar";
import '../styles/pages/orphanage.css';
import api from "../services/api";


const happyMapIcon = L.icon({
  iconUrl: mapMarkerImg,

  iconSize: [58, 68],
  iconAnchor: [29, 68],
  popupAnchor: [0, -60]
})

interface Orphanage {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: string;
  images: Array<{
    id: number;
    url: string;
  }>
}

interface OrphanageParams{
  id: string
}

export default function Orphanage() {
  const params = useParams<OrphanageParams>()
    const[Orphanage, setOrphanage] = useState<Orphanage>()
      const [activeImageIndex, setActiveImageIndex] = useState(0)

    useEffect(() => {
        api.get(`Orphanages/${params.id}`).then(response => {
            setOrphanage(response.data)
        })
    }, [params.id])

if (!Orphanage){
  return<p>Carregando...</p>
}
  return (
    <div id="page-Orphanage">
      <Sidebar/>

      <main>
        <div className="Orphanage-details">
          <img src= {Orphanage.images[0].url} alt={Orphanage.name} />

          <div className="images">
            {Orphanage.images.map((image, index) =>{
              return(
                <button 
                key={image.id}
                 className={activeImageIndex === index ? 'active' : ''}
                  type="button"
                  onClick={()=>{
                    setActiveImageIndex(index)
                  }}
                  >
              <img src={image.url} alt={Orphanage.name} />
            </button>
              )
            })}
            
          </div>
          
          <div className="Orphanage-details-content">
            <h1>{Orphanage.name}</h1>
            <p>{Orphanage.about}</p>

            <div className="map-container">
              <Map 
                center={[Orphanage.latitude, Orphanage.longitude]} 
                zoom={16} 
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer 
                  url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
                <Marker interactive={false} icon={happyMapIcon}
                 position={[Orphanage.latitude, Orphanage.longitude]} />
              </Map>

              <footer>
                <a target="_blank" rel="noopener noreferrer"href={`https://www.google.com/maps/dir/?api=1&destination=${Orphanage.latitude}, ${Orphanage.longitude}`}>Ver rotas no Google Maps</a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
  <p>{Orphanage.instructions}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                {Orphanage.opening_hours}
              </div>
              {Orphanage.open_on_weekends ? (
                <div className="open-on-weekends">
                <FiInfo size={32} color="#39CC83" />
                Atendemos <br />
                fim de semana
              </div>
                ) : (
                  <div className="open-on-weekends dont-open">
                <FiInfo size={32} color="#ff669d" />
                Nao atendemos <br />
                fim de semana
              </div>
                )}
            </div>

            <button type="button" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}