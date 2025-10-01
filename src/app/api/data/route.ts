import { NextResponse } from 'next/server';

export async function GET() {
  const countries = [
    "Belize",
    "Guatemala",
    "Honduras",
    "El Salvador",
    "Nicaragua",
    "Costa Rica",
    "Panama"
  ];

  const clubs = [
    "Rotaract Club of Belize City",
    "Rotaract Club of Orange Walk",
    "Rotaract Club of Corozal",
    "Rotaract Club of Benque Viejo",
    "Rotaract Club of Belmopan",
    "Rotaract Club of San Ignacio",
    "Rotaract Club of Los Altos Quetzaltenango",
    "Rotaract Club of Antigua Guatemala",
    "Rotaract Club of Aurora",
    "Rotaract Club of Choloma",
    "Rotaract Club of Choluteca",
    "Rotaract Club of Ciudad de Guatemala",
    "Rotaract Club of Coatepeque Colomba",
    "Rotaract Club of Comunidad Universitaria & Profesional",
    "Rotaract Club of Danlí",
    "Rotaract Club of Del Valle de Guatemala",
    "Rotaract Club of El Progreso",
    "Rotaract Club of Fuerza Tegucigalpa Sur",
    "Rotaract Club of Guatemala de La Asunción",
    "Rotaract Club of Guatemala de la Ermita",
    "Rotaract Club of Guatemala entre Volcanes",
    "Rotaract Club of Guatemala La Reforma",
    "Rotaract Club of Guatemala Las Americas",
    "Rotaract Club of Guatemala Metropoli",
    "Rotaract Club of Guatemala Norte",
    "Rotaract Club of Guatemala Oeste",
    "Rotaract Club of Guatemala Sur",
    "Rotaract Club of Guatemala Vista Hermosa",
    "Rotaract Club of Huehuetenango",
    "Rotaract Club of La Ceiba",
    "Rotaract Club of Merendón",
    "Rotaract Club of Puerto Cortés",
    "Rotaract Club of Quetzaltenango",
    "Rotaract Club of San Miguel de Heredia",
    "Rotaract Club of San Pedro Sula",
    "Rotaract Club of Santa Barbara",
    "Rotaract Club of Santa Cruz",
    "Rotaract Club of Santa Rosa de Copán",
    "Rotaract Club of Tegucigalpa",
    "Rotaract Club of Tegucigalpa Sur",
    "Rotaract Club of Tela",
    "Rotaract Club of Tikal Petén",
    "Rotaract Club of Unitec Metropolitano",
    "Rotaract Club of Usula",
    "Rotaract Club of Uwara Kik'",
    "Rotaract Club of Valle de Sula",
    "Rotaract Club of Villa Real de Tegucigalpa"
  ];

  return NextResponse.json({ countries, clubs });
}