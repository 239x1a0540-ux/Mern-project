export default function CustomerWallet() {
  return (
    <div className="ud-content">
      <div className="ud-wallet-card">
        <p className="ud-wallet-label">Available Balance</p>
        <p className="ud-wallet-amount">₹ 0.00</p>
        <div className="ud-wallet-btns">
          <button className="ud-wallet-btn add">Add Money</button>
          <button className="ud-wallet-btn pay">Pay Now</button>
        </div>
      </div>

      <div className="ud-wallet-stats">
        <div className="ud-wstat"><p className="ud-wstat-label">Earned</p><p className="ud-wstat-val green">+₹0</p></div>
        <div className="ud-wstat"><p className="ud-wstat-label">Spent</p><p className="ud-wstat-val red">-₹0</p></div>
        <div className="ud-wstat"><p className="ud-wstat-label">Transactions</p><p className="ud-wstat-val">0</p></div>
      </div>

      <div className="ud-panel-card">
        <div className="ud-panel-head">
          <h3>Transaction History</h3>
          <span>0 transactions</span>
        </div>
        <div className="ud-tx-list">
          <p style={{ color: "#9ca3af", fontSize: "0.85rem", textAlign: "center", padding: "20px 0" }}>
            No transactions yet.
          </p>
        </div>
      </div>
    </div>
  );
}
