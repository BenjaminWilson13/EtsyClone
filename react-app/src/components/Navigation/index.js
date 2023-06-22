import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import './Navigation.css';
import LoginFormModal from '../LoginFormModal';
import { logout } from "../../store/session";
import EditProductModal from '../EditProductModal/index'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import SignupFormModal from '../SignupFormModal';

function Navigation({ isLoaded }) {
	const sessionUser = useSelector(state => state.session.user);
	const dispatch = useDispatch();
	const history = useHistory();
	const [searchQuery, setSearchQuery] = useState(''); 
	const handleLogout = (e) => {
		e.preventDefault();
		dispatch(logout());
	};

	const handleSearch = (e) => {
		e.preventDefault(); 
		history.push(`/${searchQuery}`)
	}

	const handleEnter = (e) => {
		if (e.key === "Enter") {
			handleSearch(e)
		}
	}

	//categories: Outdoor, Artwork, Jewelry, Automotive, Electronic, Clothing, Collectable
	const categories = ['All Products', 'Artwork', 'Automotive', 'Clothing', 'Collectable', 'Electronic', 'Jewelry', 'Outdoor']

	return (
		<>
			<div className='nav-box'>
				<h1 className='site-logo'>Customey</h1>
				<input className='search-box' value={searchQuery} type='text' placeholder='Search for Anything' onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={handleEnter}/>
				<div className='nav-button-box'>
					{sessionUser ?
						<>
							<button className='log-button' onClick={handleLogout}>Sign Out</button>
							<button className='log-button' onClick={() => history.push('/shoppingCart')}>Cart</button>
							<OpenModalButton className='log-button' buttonText="New Product" modalComponent={<EditProductModal newProduct={true} />} />
						</>
						:
						<>
							<OpenModalButton
								className="log-button"
								buttonText="Log In"
								modalComponent={<LoginFormModal />} />
							<OpenModalButton
								className="log-button"
								buttonText="Sign Up"
								modalComponent={<SignupFormModal />} />
						</>
					}
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