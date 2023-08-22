import React, { useState, useEffect } from 'react';
import { UseStateValue } from './pages/CartState';
import { auth, db } from './firebase';
import './Header.css'
import { useNavigate } from 'react-router-dom';
import { Input } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24, 
    p: 4,
};


function Header() {
    const [user, setUser] = useState(null)
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [openLogIn, setOpenLogIn] = useState(false);
    const [openRegister, setOpenRegister] = useState(false)
    const [loginError, setLoginError] = useState(false);
    const [registerError, setRegisterError] = useState(false)

    const closeLogIn = () => setOpenLogIn(false)
    const closeRegister = () => setOpenRegister(false)
    const [openCatalog, setOpenCatalog] = useState(false);
    const closeCatalog = () => setOpenCatalog(false);

    const goto_phones = () => navigate('/phones')
    const goto_laptops = () => navigate('/laptops')

    const [{ cart }] = UseStateValue();
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(authUser => {
          if (authUser) {
            console.log(authUser);
            setUser(authUser);
          } else {
            setUser(null)
          }
        }) 
    
        return () => {
          unsubscribe();
        }
    }, [user]);


    const navigate = useNavigate();
    const goto_home = () => {
        navigate('/')
    }
    
    const goto_settings = () => {
        navigate('/settings')
    }

    const goto_cart = () => {
        navigate('/cart')
    }
    const register = (event) => {
        event.preventDefault();
        auth
          .createUserWithEmailAndPassword(email, password)
          .then((authUser) => {
            authUser.user.updateProfile({
                displayFirstName: firstName,
                displayLastName: lastName,
                displayEmail: email,
            })
          })
          .catch(() => {
            setOpenRegister(true)
            setRegisterError(true)
            });
        setOpenRegister(false)
    };
    
    const logIn = (event) => {
        event.preventDefault();
    
        auth
          .signInWithEmailAndPassword(email, password)
          .catch(() => {
            setOpenLogIn(true);
            setLoginError(true);
          })
        setOpenLogIn(false)
    }
    return (
        <div className="App">
            <div className="header"> 
                <button className="sipnav" onClick={goto_home}><b>Sipnav</b></button>

                <button className='cart' onClick={goto_cart}> 
                    <img src="/cart.png" alt="" className="icon__cart" /> 
                    <div className='product_count'><b>{cart.length}</b></div>
                </button>

                {user ? (
                    <button className='account'> 
                        <img src="/account.png" alt="" className="icon__account" /> 
                        <div className="dropdown_menu">
                            <div className="options" onClick={() => auth.signOut()}>Log out</div>
                        </div>
                    </button>
                    ): (
                        <button className='login' onClick={() => setOpenLogIn(true)}>Log in</button>
                )}
                
                <Modal open={openLogIn} onClose={closeLogIn}>
                    <Box sx={style}>
                    <form className='box_login'>
                        <img 
                            className="app__headerImage"
                            src="instagramLogo.png"
                            alt="" width={100}/>
                        <Input
                            placeholder="email" type="text" value={email} 
                            onChange={(e) => setEmail(e.target.value)}/>
                        <Input
                            placeholder="password" type="password" value={password}
                            onChange={(e) => setPassword(e.target.value)}/>  
                        <div className="login_error" style={{ display: loginError ? 'block' : 'none' }}>Incorred email or password. Try again</div>
                        <Button type="submit" onClick={logIn}>Log In</Button>
                        <div><b>Don't have an account?</b></div>
                        <Button onClick={() => {
                            setOpenLogIn(false)
                            setOpenRegister(true)}}>Register here
                        </Button>
                    </form>
                    </Box>
                </Modal>

                <Modal open={openRegister} onClose={closeRegister}>
                    <Box sx={style}>
                    <form className='box_register'>
                        <img 
                            className="app__headerImage"
                            src="instagramLogo.png"
                            alt="" width={100}/>
                        <Input
                            placeholder="First Name" type="text" value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)}/>
                        <Input
                            placeholder="Last Name" type="text" value={lastName}
                            onChange={(e) => setLastName(e.target.value)}/>  
                        <Input
                            placeholder="email" type="text" value={email}
                            onChange={(e) => setEmail(e.target.value)}/>
                        <Input
                            placeholder="password" type="password" value={password}
                            onChange={(e) => setPassword(e.target.value)}/>
                        <div className="register_error" style={{ display: registerError ? 'block' : 'none' }}>This email is already registered.</div>
                        <Button type='submit' onClick={register}>Register</Button>
                    </form>
                    </Box>
                </Modal>
            </div>
                
            <div className="Heading">
                <button className="catalog" onClick={() => setOpenCatalog(true)}>
            <img className='catalog_icon' src="/catalog.png"/>Product Catalog</button>
            </div>
                
            <Modal open={openCatalog} onClose={closeCatalog}>
                <Box sx={style}>
                    <div className="catalog_products">
                        <button className="phones" onClick={goto_phones}>Phones</button>
                        <button className="laptops" onClick={goto_laptops}>Laptops</button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default Header;