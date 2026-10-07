import { useEffect, useMemo, useState } from 'react'
import { supabase } from './lib/supabase'

const FALLBACK_PRODUCTS = [
  { id: 1, name: 'Coffee — Academic Comeback', price: 45, emoji: '☕', description: 'This semester is still salvageable.' },
  { id: 2, name: 'Sandwich — Deadline Fuel', price: 50, emoji: '🥪', description: 'Nutrition for assignments submitted at 11:59 PM.' },
  { id: 3, name: 'Soft Drink — Denial Edition', price: 35, emoji: '🥤', description: 'Hydration, but academically questionable.' },
  { id: 4, name: 'Cookies — Cram Session Pack', price: 25, emoji: '🍪', description: 'For when studying becomes emotional eating.' },
  { id: 5, name: 'Bottled Water — Hydration Before Recitation', price: 20, emoji: '💧', description: 'Stay hydrated while pretending you reviewed.' },
  { id: 6, name: 'Chocolate — Group Project Therapy', price: 25, emoji: '🍫', description: "When 'seen' is their only contribution." },
  { id: 7, name: 'Emergency Yellow Pad', price: 20, emoji: '📄', description: 'Because someone always says one whole sheet.' },
  { id: 8, name: '1% Battery Survival Cable', price: 79, emoji: '🔌', description: 'Your phone has chosen violence.' },
]

const peso = value => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(value || 0))
const makeReference = () => {
  const d = new Date()
  const stamp = [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('')
    + '-' + [d.getHours(), d.getMinutes(), d.getSeconds()].map(n => String(n).padStart(2, '0')).join('')
  return `TXN-${stamp}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

function App() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS)
  const [cart, setCart] = useState([])
  const [screen, setScreen] = useState('items')
  const [method, setMethod] = useState('')
  const [cashInput, setCashInput] = useState('')
  const [toast, setToast] = useState('')
  const [processing, setProcessing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [receipt, setReceipt] = useState(null)

  useEffect(() => {
    if (!supabase) return
    supabase.from('products').select('*').eq('active', true).order('sort_order').then(({ data, error }) => {
      if (!error && data?.length) setProducts(data)
    })
  }, [])
  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(timer)
  }, [toast])

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart])
  const itemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])
  const notify = message => setToast(message)
  const addProduct = product => {
    setCart(current => {
      const present = current.find(item => item.id === product.id)
      return present ? current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }]
    })
    notify(`Product added — ${product.name.split(' — ')[0]}`)
  }
  const changeQuantity = (id, difference) => setCart(current => current.flatMap(item => {
    if (item.id !== id) return [item]
    const quantity = item.quantity + difference
    return quantity > 0 ? [{ ...item, quantity }] : []
  }))
  const removeItem = id => {
    const product = cart.find(item => item.id === id)
    setCart(current => current.filter(item => item.id !== id))
    if (product) notify(`Item removed — ${product.name.split(' — ')[0]}`)
  }
  const condition = itemCount <= 2 ? ['STABLE', 'Minor academic turbulence.'] : itemCount <= 4 ? ['COOKED', 'Consider reviewing your life choices.'] : ['ACADEMIC DEFCON 1', 'Godspeed.']

  const saveOrder = async transaction => {
    if (!supabase) return true
    const { data: order, error: orderError } = await supabase.from('orders').insert({
      transaction_ref: transaction.reference, total: transaction.total, payment_method: transaction.method,
      amount_paid: transaction.amountPaid, change: transaction.change,
    }).select('id').single()
    if (orderError) throw orderError
    const { error: itemError } = await supabase.from('order_items').insert(transaction.items.map(item => ({
      order_id: order.id, product_id: item.id, product_name: item.name, quantity: item.quantity,
      unit_price: item.price, subtotal: item.price * item.quantity,
    })))
    if (itemError) throw itemError
    return true
  }
  const finalizePayment = async (chosenMethod, amountPaid) => {
    if (processing || saving) return
    setProcessing(true); setSaveError(false); notify('Processing payment...')
    await new Promise(resolve => setTimeout(resolve, 650))
    const transaction = { reference: makeReference(), date: new Date().toLocaleString('en-PH'), items: cart.map(item => ({ ...item })), total, method: chosenMethod, amountPaid, change: amountPaid - total }
    setSaving(true)
    try {
      await saveOrder(transaction)
      setReceipt(transaction); setScreen('success'); notify('Payment successful')
    } catch (error) {
      setSaveError(true); notify('Save failed — Retry')
    } finally {
      setSaving(false); setProcessing(false)
    }
  }
  const payCash = () => {
    const amount = Number(cashInput)
    if (!cashInput.trim() || !Number.isFinite(amount) || amount < 0) return notify('Invalid amount')
    if (amount < total) return notify('Insufficient payment')
    finalizePayment('Cash', amount)
  }
  const newTransaction = () => {
    setCart([]); setScreen('items'); setMethod(''); setCashInput(''); setProcessing(false); setSaving(false); setSaveError(false); setReceipt(null); setToast('Ready for a new academic emergency.')
  }

  const OrderLines = ({ items = cart }) => <div className="line-list">{items.map(item => <div className="order-line" key={item.id}>
    <div><strong>{item.name}</strong><span>{peso(item.price)} each</span></div>
    <strong>{item.quantity} × {peso(item.price)}</strong><strong>{peso(item.price * item.quantity)}</strong>
  </div>)}</div>
  const Total = ({ value = total }) => <div className="total"><span>Total</span><strong>{peso(value)}</strong></div>

  return <main className="app-shell">
    <header><div><p className="eyebrow">TOUCHSCREEN POINT OF SALE</p><h1>CRAM <i>MART</i></h1><p>Academic emergencies. Questionable solutions.</p></div><div className="cart-badge">Current order<br /><strong>{itemCount} item{itemCount !== 1 ? 's' : ''}</strong></div></header>
    {toast && <div className="toast" role="status">{toast}</div>}

    {screen === 'items' && <section className="item-screen"><div className="screen-title"><div><p className="eyebrow">STEP 1 OF 3</p><h2>What survived the semester?</h2></div><p>Tap a product to add it.</p></div><div className="pos-layout"><div className="product-grid">{products.map(product => <article className="product-card" key={product.id} onClick={() => addProduct(product)} tabIndex="0" onKeyDown={e => e.key === 'Enter' && addProduct(product)}><span className="emoji">{product.emoji}</span><h3>{product.name}</h3><strong>{peso(product.price)}</strong><p>{product.description}</p><button onClick={e => { e.stopPropagation(); addProduct(product) }}>Add</button></article>)}</div><aside className="cart-panel"><h2>Current Order</h2>{cart.length === 0 ? <p className="empty">Your cart is waiting for a rescue mission.</p> : cart.map(item => <div className="cart-item" key={item.id}><div><strong>{item.name}</strong><span>{peso(item.price)} · Subtotal {peso(item.price * item.quantity)}</span></div><div className="quantity"><button aria-label={`Decrease ${item.name}`} onClick={() => changeQuantity(item.id, -1)}>−</button><b>{item.quantity}</b><button aria-label={`Increase ${item.name}`} onClick={() => changeQuantity(item.id, 1)}>+</button><button className="remove" onClick={() => removeItem(item.id)}>Remove</button></div></div>)}<Total /><button className="primary wide" disabled={!cart.length} onClick={() => setScreen('summary')}>Proceed to Review →</button></aside></div></section>}

    {screen === 'summary' && <section className="flow-card"><p className="eyebrow">STEP 2 OF 3</p><h2>Order Summary</h2><OrderLines /><Total /><div className="actions"><button className="secondary" onClick={() => setScreen('items')}>← Back to Modify Order</button><button className="primary" onClick={() => setScreen('payment')}>Continue to Payment →</button></div></section>}

    {screen === 'payment' && <section className="flow-card"><p className="eyebrow">STEP 3 OF 3</p><h2>Choose Payment Method</h2><Total /><div className="payment-options"><button onClick={() => { setMethod('Cash'); setScreen('cash') }}><span>💵</span>Cash</button><button onClick={() => { setMethod('QR Payment'); setScreen('qr') }}><span>▦</span>QR Payment</button><button onClick={() => { setMethod('Credit/Debit Card'); setScreen('card') }}><span>💳</span>Credit / Debit Card</button></div><button className="text-button" onClick={() => setScreen('summary')}>← Back to summary</button></section>}

    {screen === 'cash' && <section className="flow-card payment-card"><button className="text-button" onClick={() => setScreen('payment')}>← Payment methods</button><h2>Cash Payment</h2><p className="allowance">How much money survived your allowance?</p><Total /><label>Amount Paid<input inputMode="decimal" type="text" value={cashInput} onChange={e => setCashInput(e.target.value)} placeholder="₱0.00" /></label><div className="actions"><button className="secondary" onClick={() => setCashInput(String(total))}>Pay Exact Amount</button><button className="primary" disabled={processing || saving} onClick={payCash}>{processing || saving ? 'Processing payment...' : 'Pay Now'}</button></div>{saveError && <p className="error">Save failed — Retry payment. Your order is still intact.</p>}</section>}

    {screen === 'qr' && <section className="flow-card payment-card"><button className="text-button" onClick={() => setScreen('payment')}>← Payment methods</button><h2>QR Payment</h2><Total /><div className="qr-placeholder">▦<span>CRAM MART QR</span></div><p>Scan the QR code using your supported payment application.</p><button className="primary wide" disabled={processing || saving} onClick={() => finalizePayment('QR Payment', total)}>{processing || saving ? 'Processing payment...' : 'Confirm QR Payment'}</button>{saveError && <p className="error">Save failed — Retry</p>}</section>}

    {screen === 'card' && <section className="flow-card payment-card"><button className="text-button" onClick={() => setScreen('payment')}>← Payment methods</button><h2>Credit / Debit Card</h2><Total /><div className="card-icon">💳</div><p>Please tap, insert, or swipe your card.</p><button className="primary wide" disabled={processing || saving} onClick={() => finalizePayment('Credit/Debit Card', total)}>{processing || saving ? 'Processing payment...' : 'Process Card Payment'}</button>{saveError && <p className="error">Save failed — Retry</p>}</section>}

    {screen === 'success' && receipt && <section className="flow-card success"><div className="success-mark">✓</div><p className="eyebrow">PAYMENT SUCCESSFUL</p><h2>Academic crisis averted.</h2><div className="success-data"><span>Transaction amount <b>{peso(receipt.total)}</b></span><span>Amount paid <b>{peso(receipt.amountPaid)}</b></span><span>Payment method <b>{receipt.method}</b></span><span>Reference <b>{receipt.reference}</b></span></div><button className="primary wide" onClick={() => setScreen('receipt')}>View Receipt</button></section>}

    {screen === 'receipt' && receipt && <section className="receipt"><div className="receipt-top"><p>CRAM MART</p><span>Academic emergencies. Questionable solutions.</span></div><h2>Digital Receipt</h2><p><b>{receipt.reference}</b><br />{receipt.date}</p><OrderLines items={receipt.items} /><Total value={receipt.total} /><div className="receipt-meta"><span>Payment method <b>{receipt.method}</b></span><span>Amount paid <b>{peso(receipt.amountPaid)}</b></span><span>Change <b>{peso(receipt.change)}</b></span><span>Status <b>Payment Successful</b></span></div><div className="condition"><p>Academic Condition</p><strong>{condition[0]}</strong><span>{condition[1]}</span></div><footer>Thank you for shopping.<br />Please submit your assignment.</footer><button className="primary wide" onClick={newTransaction}>New Transaction</button></section>}
  </main>
}

export default App
