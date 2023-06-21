import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import "./ProductImageModal.css";

export default function ProductImageModal(imageURL) {
    return (
        <img src={imageURL} />
    )
}