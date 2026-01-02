package com.ecommerce.backend.dto;

import java.util.List;

import com.ecommerce.backend.entity.ShippingAddress;

public class CheckoutRequestDTO {

    private List<OrderItemRequestDTO> items;
    private ShippingAddress shippingAddress;
    private CardPaymentDTO payment;

    // getters and setters

    public List<OrderItemRequestDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequestDTO> items) {
        this.items = items;
    }

    public ShippingAddress getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(ShippingAddress shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public CardPaymentDTO getPayment() {
        return payment;
    }

    public void setPayment(CardPaymentDTO payment) {
        this.payment = payment;
    }
}
