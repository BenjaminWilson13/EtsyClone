import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpecificProduct } from '../../store/products';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import "./EditProductModal.css"
import OpenModalButton from '../OpenModalButton';

export default function EditProductModal() {

    return (<h1>Heyo</h1>)
}