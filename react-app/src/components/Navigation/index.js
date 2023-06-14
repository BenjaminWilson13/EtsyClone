import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import './Navigation.css';
import LoginFormModal from '../LoginFormModal';
import { logout } from "../../store/session";

function Navigation({ isLoaded }) {
	const sessionUser = useSelector(state => state.session.user);
	const dispatch = useDispatch();
	const handleLogout = (e) => {
		e.preventDefault();
		dispatch(logout());
	};

	//categories: Outdoor, Artwork, Jewelry, Automotive, Electronic, Clothing, Collectable
	const categories = ['Artwork', 'Automotive', 'Clothing', 'Collectable', 'Electronic', 'Jewelry', 'Outdoor']

	return (
		<>
			<div className='nav-box'>
				<h1 className='site-logo'>Customey</h1>
				<input className='search-box' type='text' placeholder='Search for Anything' />
				<div className='nav-button-box'>
					{sessionUser ?
						<button className='log-button' onClick={handleLogout}>Sign Out</button>
						:
						<OpenModalButton
							className="log-button"
							buttonText="Log In"
							modalComponent={<LoginFormModal />} />
					}
					<button className='log-button'>Cart</button>
				</div>
			</div>
			<div className='links-box'>{categories.map((category) => {
				return (
					<NavLink key={category} className="category-nav-link" to={`/${category}`}>{category}</NavLink>
				)
			})}</div>
			<div className='line-break'></div>
		</>






















	);
}

export default Navigation;