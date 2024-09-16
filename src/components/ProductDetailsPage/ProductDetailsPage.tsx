// import { Accessories, Product, ProductChars } from '../../types';
// import { CardComponent } from '../main/CardComponent/CardComponent';
import { useParams } from 'react-router-dom';
import { usePhones } from '../../context/PhonesProvider';
import { useTablets } from '../../context/TabletProvider';
import { useAccessories } from '../../context/AccessoriesProvider';
import { useEffect, useState } from 'react';
import { Accessories, ProductChars } from '../../types';
import { Header } from '../HomePage/Header/header';
import { Footer } from '../Footer/Footer';
import styles from './productsDetails.module.scss';
import cardStyles from '.././main/CardComponent/card.module.scss';
import { CardComponent } from '../main/CardComponent/CardComponent';
import {
  nextSlide,
  previousSlide,
} from '../main/CardComponent/slider_function';
import row from '../HomePage/Welcome/productSlider.module.scss';
import buttom from '../HomePage/Welcome/homeface.module.scss';
import classNames from 'classnames';

type Device = ProductChars | Accessories;

export const ProductDetailsPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [items, setItems] = useState<Device | undefined>(undefined);
  const [relatedProducts, setRelatedProducts] = useState<Device[]>([]);

  const { category, itemId } = useParams<{
    category: string;
    itemId: string;
  }>();
  const phones = usePhones();
  const tablets = useTablets();
  const accessories = useAccessories();

  const totalSlides = items ? phones.length : 0;

  useEffect(() => {
    const filterItem = (id: string) => {
      const foundItem =
        category === 'phones'
          ? phones.find(device => device.id === id)
          : category === 'tablets'
            ? tablets.find(device => device.id === id)
            : category === 'accessories'
              ? accessories.find(device => device.id === id)
              : undefined;

      setItems(foundItem);

      if (foundItem) {
        const fetchRelatedProducts = () => {
          let products: Device[] = [];

          switch (category) {
            case 'phones':
              products = phones.filter(device => device.id !== id);
              break;
            case 'tablets':
              products = tablets.filter(device => device.id !== id);
              break;
            case 'accessories':
              products = accessories.filter(device => device.id !== id);
              break;
          }

          const shuffleArray = (array: Device[]) => {
            return array.sort(() => Math.random() - 0.5);
          };

          const randomProducts = shuffleArray(products).slice(0, 4);

          setRelatedProducts(randomProducts);
        };

        fetchRelatedProducts();
      }
    };

    if (itemId) {
      filterItem(itemId);
    }
  }, [itemId, phones, tablets, accessories]);

  if (!items) {
    return <div>Item not found</div>;
  }

  return (
    <>
      <Header />

      <div className={styles.product_title}>
        <div>{`home > ${category} > ${items.name}`}</div>

        <div>
          <h1 className={styles.product_h1}>{items.name}</h1>
        </div>

        <div className={styles.product_titlecontainer}>
          <div className={styles.product_container}>
            <div className={styles.product_carousel_container}>
              <div className={styles.product_carousel}>
                {items.images.map((img, index) => (
                  <img
                    src={img}
                    alt={`Image ${index}`}
                    key={index}
                    className={
                      selectedImage === index ? `${styles.active}` : ''
                    }
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>

              <div className={styles.product_mainimg}>
                <img
                  src={items.images[selectedImage]}
                  alt=""
                  className={styles.product_img}
                />
              </div>
            </div>

            <div className={styles.product_char}>
              <div>
                <span className={cardStyles.card_stats_left}>
                  Available colors
                </span>
                <div className={styles.product_char_capacity_container}>
                  {items.colorsAvailable.map(color => (
                    <div key={color} style={{ backgroundColor: color }}>
                      {color}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className={cardStyles.card_stats_left}>
                  Select capacity
                </span>
                <div className={styles.product_char_capacity_container}>
                  {items.capacityAvailable.map(cap => (
                    <div key={cap} className={styles.product_char_capacity}>
                      {cap}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className={styles.product_price}>
                  <h2 className={styles.product_price_text}>
                    {`$${items.priceRegular}`}
                  </h2>

                  <h2
                    className={styles.product_price_sale}
                  >{`$${items.priceDiscount}`}</h2>
                </div>

                <div className={cardStyles.card_buy_container}>
                  <button className={cardStyles.card_buy_button}>
                    Add to card
                  </button>
                  <button className={cardStyles.card_follow_button}>
                    <img src="./img/Vector(Heart).svg" alt="heart" />
                  </button>
                </div>
              </div>

              <div className={cardStyles.card_stats}>
                <div className={cardStyles.card_stats_text}>
                  <span className={cardStyles.card_stats_left}>screen</span>
                  <span className={cardStyles.card_stats_right}>
                    {items.screen}
                  </span>
                </div>

                <div className={cardStyles.card_stats_text}>
                  <span className={cardStyles.card_stats_left}>resolution</span>
                  <span className={cardStyles.card_stats_right}>
                    {items.resolution}
                  </span>
                </div>

                <div className={cardStyles.card_stats_text}>
                  <span className={cardStyles.card_stats_left}>capacity</span>
                  <span className={cardStyles.card_stats_right}>
                    {items.capacity}
                  </span>
                </div>

                <div className={cardStyles.card_stats_text}>
                  <span className={cardStyles.card_stats_left}>ram</span>
                  <span className={cardStyles.card_stats_right}>
                    {items.ram}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.product_info}>
          <div className={styles.product_info_about}>
            <h2 className={styles.product_info_title}>About</h2>
            {items.description.map((item, index) => (
              <>
                <div key={index} className={styles.product_info_about_title}>
                  {item.title}
                </div>

                <div className={styles.product_info_about_text}>
                  {item.text[0]}
                </div>

                {item.text[1] && (
                  <div className={styles.product_info_about_text}>
                    {item.text[1]}
                  </div>
                )}
              </>
            ))}
          </div>

          <div className={styles.product_info_tech}>
            <h2 className={styles.product_info_title}>Tech specs</h2>

            <div className={styles.product_info_tech_container}>
              <div className={styles.product_info_tech_left}>screen</div>
              <div className={styles.product_info_tech_right}>
                {items.screen}
              </div>
            </div>
            <div className={styles.product_info_tech_container}>
              <div className={styles.product_info_tech_left}>resolution</div>
              <div className={styles.product_info_tech_right}>
                {items.resolution}
              </div>
            </div>
            <div className={styles.product_info_tech_container}>
              <div className={styles.product_info_tech_left}>processor</div>
              <div className={styles.product_info_tech_right}>
                {items.processor}
              </div>
            </div>
            <div className={styles.product_info_tech_container}>
              <div className={styles.product_info_tech_left}>ram</div>
              <div className={styles.product_info_tech_right}>{items.ram}</div>
            </div>
            <div className={styles.product_info_tech_container}>
              <div className={styles.product_info_tech_left}>camera</div>
              <div className={styles.product_info_tech_right}>
                {'camera' in items ? items.camera : ''}
              </div>
            </div>
            <div className={styles.product_info_tech_container}>
              <div className={styles.product_info_tech_left}>zoom</div>
              <div className={styles.product_info_tech_right}>
                {'zoom' in items ? items.zoom : ''}
              </div>
            </div>
            <div className={styles.product_info_tech_container}>
              <div className={styles.product_info_tech_left}>cell</div>
              <div className={styles.product_info_tech_right}>
                {items.cell.join(', ')}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className={styles.product_carousel_slider}>
            <div>
              <h2 className={styles.product_h1}>You may also like</h2>
            </div>

            <div className={row.slider_buttons}>
              <button
                className={classNames(buttom.product_slide_buttons)}
                onClick={() =>
                  previousSlide({ currentSlide, setCurrentSlide, totalSlides })
                }
              >
                &lt;
              </button>

              <button
                className={classNames(buttom.product_slide_buttons)}
                onClick={() =>
                  nextSlide({ currentSlide, setCurrentSlide, totalSlides })
                }
              >
                &gt;
              </button>
            </div>
          </div>

          <div className={row.slider_container}>
            <div
              className={row.slider_card}
              style={{
                transform: `translateX(calc(-${currentSlide * 25}%))`,
              }}
            >
              {relatedProducts.map(product => (
                <CardComponent key={product.id} devices={product} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
