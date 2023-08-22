import './Home.css'
import Header from '../Header'
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import Products from './Products'
function Home() {
    const [laptopsData, setLaptopsData] = useState([])
    const [phonesData, setPhonesData] = useState([])
    useEffect(() => {
        db.collection('phones').onSnapshot(snapshot => {
            setPhonesData(snapshot.docs.map(doc => doc.data()))
        })
    }, [])
    useEffect(() => {
        db.collection('laptops').onSnapshot(snapshot => {
            setLaptopsData(snapshot.docs.map(doc => doc.data()))
        })
    }, [])

    const allProducts = [...laptopsData, ...phonesData];
    const randomProducts = (products, count) => {
        const newArray = products.sort(() => 0.5 - Math.random())
        return newArray.slice(0, count);
    }

    const forYou_Products = randomProducts(allProducts, 4)
    const bestSellers_Products = randomProducts(allProducts, 4)
    const newProducts_Products = randomProducts(allProducts, 4)

    return(
        <div className="App">
            <Header/>
                <div className='home_titles'><b>For you</b></div>
                <div className="home_boxes">
                    {forYou_Products.map(product => (
                        <Products
                            name={product.name}
                            price={product.price}
                            img={product.img}
                            descr={product.descr}
                        />
                    ))}
                </div>

                <div className='home_titles'><b>Best Sellers</b></div>
                <div className="home_boxes">
                    {bestSellers_Products.map(product => (
                        <Products
                            name={product.name}
                            price={product.price}
                            img={product.img}
                            descr={product.descr}
                        />
                    ))}
                </div>

                <div className='home_titles'><b>New Products</b></div>
                <div className="home_boxes">
                    {newProducts_Products.map(product => (
                        <Products
                            name={product.name}
                            price={product.price}
                            img={product.img}
                            descr={product.descr}
                        />
                    ))}
                </div>
        </div>
    )
}

export default Home;