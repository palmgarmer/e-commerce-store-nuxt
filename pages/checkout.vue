<template>
  <div class="checkout-page">
    <div class="container">
      <div class="checkout-header">
        <h1>Checkout</h1>
        <div class="checkout-steps">
          <div class="step" :class="{ active: step >= 1 }">
            <span class="step-number">1</span>
            <span class="step-label">Shipping</span>
          </div>
          <div class="step" :class="{ active: step >= 2 }">
            <span class="step-number">2</span>
            <span class="step-label">Payment</span>
          </div>
          <div class="step" :class="{ active: step >= 3 }">
            <span class="step-number">3</span>
            <span class="step-label">Review</span>
          </div>
        </div>
      </div>

      <div class="checkout-content">
        <div class="checkout-form">
          <!-- Step 1: Shipping Information -->
          <div v-if="step === 1" class="checkout-step">
            <h2>Shipping Information</h2>

            <form @submit.prevent="nextStep">
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName" class="form-label">First Name</label>
                  <input
                    id="firstName"
                    v-model="shippingForm.firstName"
                    type="text"
                    class="form-input"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="lastName" class="form-label">Last Name</label>
                  <input
                    id="lastName"
                    v-model="shippingForm.lastName"
                    type="text"
                    class="form-input"
                    required
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="address" class="form-label">Street Address</label>
                <input
                  id="address"
                  v-model="shippingForm.address"
                  type="text"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="city" class="form-label">City</label>
                  <input
                    id="city"
                    v-model="shippingForm.city"
                    type="text"
                    class="form-input"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="state" class="form-label">State</label>
                  <input
                    id="state"
                    v-model="shippingForm.state"
                    type="text"
                    class="form-input"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="zipCode" class="form-label">ZIP Code</label>
                  <input
                    id="zipCode"
                    v-model="shippingForm.zipCode"
                    type="text"
                    class="form-input"
                    required
                  />
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                  Continue to Payment
                </button>
              </div>
            </form>
          </div>

          <!-- Step 2: Payment Information -->
          <div v-else-if="step === 2" class="checkout-step">
            <h2>Payment Information</h2>

            <!-- <div class="card-js">
              <input 
                class="card-number my-custom-class" 
                name="card-number" 
                placeholder="card number"/>
              <input
                class="name"
                id="the-card-name-id"
                name="card-holders-name"
                placeholder="Name on card"
              />
              <input 
                class="expiry-month" 
                name="expiry-month" 
                placeholder="MM"/>
              <input 
                class="expiry-year" 
                name="expiry-year" 
                placeholder="YY"/>
              <input 
                class="cvc" 
                name="cvc" 
                placeholder="CVC"/>
            </div> -->

            <!-- TODO: Implement payment form -->
            <div class="incomplete-section">
              <div class="incomplete-message">
                <h3>🚧 Payment Integration Incomplete</h3>
                <p>This section needs to be implemented:</p>
                <ul>
                  <li>Credit card form with validation</li>
                  <li>Payment method selection (card, PayPal, etc.)</li>
                  <li>Card number formatting and validation</li>
                  <li>Expiry date and CVV validation</li>
                  <li>Billing address form</li>
                </ul>
              </div>
            </div>

            <div class="form-actions">
              <button @click="step = 1" class="btn btn-outline">
                Back to Shipping
              </button>
              <button @click="nextStep" class="btn btn-primary" disabled>
                Continue to Review
              </button>
            </div>
          </div>

          <!-- Step 3: Order Review -->
          <div v-else-if="step === 3" class="checkout-step">
            <h2>Order Review</h2>

            <div class="incomplete-section">
              <div class="incomplete-message">
                <h3>🚧 Order Review Incomplete</h3>
                <p>This section needs to be implemented:</p>
                <ul>
                  <li>Order summary with all items</li>
                  <li>Shipping information review</li>
                  <li>Payment method summary</li>
                  <li>Terms and conditions checkbox</li>
                  <li>Place order functionality</li>
                </ul>
              </div>
            </div>

            <div class="form-actions">
              <button @click="step = 2" class="btn btn-outline">
                Back to Payment
              </button>
              <button class="btn btn-primary" disabled>Place Order</button>
            </div>
          </div>
        </div>

        <div class="order-summary">
          <div class="summary-card">
            <h3>Order Summary</h3>

            <div class="summary-items">
              <div
                v-for="item in cartItems"
                :key="item.id"
                class="summary-item"
              >
                <div class="item-info">
                  <img
                    :src="item.product.thumbnail"
                    :alt="item.product.title"
                    class="item-image"
                  />
                  <div class="item-details">
                    <h4>{{ item.product.title }}</h4>
                    <p>Qty: {{ item.quantity }}</p>
                  </div>
                </div>
                <div class="item-price">
                  ${{ (item.product.price * item.quantity).toFixed(2) }}
                </div>
              </div>
            </div>

            <div class="summary-totals">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div class="summary-row">
                <span>Tax:</span>
                <span>${{ tax.toFixed(2) }}</span>
              </div>
              <div class="summary-row total-row">
                <span>Total:</span>
                <span>${{ finalTotal.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

const cartStore = useCartStore();
const { items: cartItems, subtotal } = storeToRefs(cartStore);

// Redirect if cart is empty
if (cartItems.value.length === 0) {
  await navigateTo("/cart");
}

const step = ref(1);

const shippingForm = reactive({
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
});

const tax = computed(() => subtotal.value * 0.08); // 8% tax
const finalTotal = computed(() => subtotal.value + tax.value);

const nextStep = () => {
  if (step.value < 3) {
    step.value++;
  }
};
</script>

<style scoped>
.checkout-page {
  padding: 2rem 0;
  min-height: 80vh;
}

.checkout-header {
  text-align: center;
  margin-bottom: 3rem;
}

.checkout-header h1 {
  margin-bottom: 2rem;
}

.checkout-steps {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.step.active {
  opacity: 1;
}

.step-number {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: var(--border-color);
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.step.active .step-number {
  background-color: var(--primary-color);
  color: white;
}

.step-label {
  font-weight: 500;
}

.checkout-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
}

.checkout-form {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
}

.checkout-step h2 {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.incomplete-section {
  background-color: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: var(--border-radius);
  padding: 2rem;
  margin-bottom: 2rem;
}

.incomplete-message h3 {
  color: #92400e;
  margin-bottom: 1rem;
}

.incomplete-message p {
  color: #92400e;
  margin-bottom: 1rem;
}

.incomplete-message ul {
  color: #92400e;
  margin-left: 1.5rem;
}

.incomplete-message li {
  margin-bottom: 0.5rem;
}

.order-summary {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.summary-card {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.summary-card h3 {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.summary-items {
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.summary-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.item-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: var(--border-radius);
}

.item-details h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
}

.item-details p {
  margin: 0;
  color: var(--text-light);
  font-size: 0.875rem;
}

.item-price {
  font-weight: 600;
  color: var(--primary-color);
}

.summary-totals {
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.total-row {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .checkout-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .checkout-steps {
    flex-direction: column;
    align-items: center;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    justify-content: center;
  }
}
</style>
