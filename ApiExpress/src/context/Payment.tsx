import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Payment {
  _id: string;
  reserva_id: string;
  monto: number;
  metodo_pago: string;
  fecha_pago: string;
  estado: string;
}