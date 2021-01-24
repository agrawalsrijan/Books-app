import React from "react";
import Rating from "@material-ui/lab/Rating";

import "./cart-item.styles.css";

const CartItem = ({
  item: { title, price, quantity, average_rating, authors },
}) => {
  return (
    <div className="cart-item">
      <div className="item-details">
        <span className="title">{title}</span>
        <span className="author">Authors: {authors}</span>
        <Rating
          name="average-rating-read"
          defaultValue={average_rating}
          precision={0.5}
          readOnly
        />

        <span className="price">
          Quantity X Price : &nbsp;{quantity} x ${price}
        </span>
      </div>
    </div>
  );
};

export default CartItem;
