import React from "react";
import "../styles/deals.css";

const deals = [
  { title: "Smart watches", discount: "-25%", img: "/images/watch.png" },
  { title: "Laptops", discount: "-15%", img: "/images/laptop.png" },
  { title: "GoPro cameras", discount: "-40%", img: "/images/camera.png" },
  { title: "Headphones", discount: "-25%", img: "/images/headphone.png" },
  { title: "Canon cameras", discount: "-25%", img: "/images/phone.png" },
];

const categories = [
  { title: "Soft chairs", price: "From USD 19", img: "/images/chair.png" },
  { title: "Sofa & chair", price: "From USD 19", img: "/images/sofa.png" },
  { title: "Kitchen dishes", price: "From USD 19", img: "/images/dishes.png" },
  { title: "Smart watches", price: "From USD 19", img: "/images/watch.png" },
  { title: "Kitchen mixer", price: "From USD 100", img: "/images/mixer.png" },
  { title: "Blenders", price: "From USD 39", img: "/images/blender.png" },
  { title: "Home appliance", price: "From USD 19", img: "/images/appliance.png" },
  { title: "Coffee maker", price: "From USD 10", img: "/images/coffee.png" },
];

export default function DealsSection() {
  return (
    <div className="container">
      {/* Deals */}
      <div className="deals">
        <div className="deal-banner">
          <h3>Deals and offers</h3>
          <p>Hygiene equipments</p>

          <div className="timer">
            <span>04<br />Days</span>
            <span>13<br />Hour</span>
            <span>34<br />Min</span>
            <span>56<br />Sec</span>
          </div>
        </div>

        {deals.map((item, index) => (
          <div className="deal-card" key={index}>
            <img src={item.img} alt={item.title} />
            <p>{item.title}</p>
            <span className="discount">{item.discount}</span>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="categories">
        <div className="category-banner">
          <h3>Home and outdoor</h3>
          <button>Source now</button>
        </div>

        {categories.map((item, index) => (
          <div className="category-card" key={index}>
            <div>
              <h4>{item.title}</h4>
              <p>{item.price}</p>
            </div>
            <img src={item.img} alt={item.title} />
          </div>
        ))}
      </div>
    </div>
  );
}
