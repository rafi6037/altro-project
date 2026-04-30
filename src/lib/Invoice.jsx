import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 40,
    backgroundColor: '#ffffff',
    color: '#0e1a12',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#1a5c38',
  },
  brand: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#1a5c38',
    letterSpacing: 3,
  },
  brandTagline: {
    fontSize: 8,
    color: '#1a5c38',
    marginTop: 2,
    letterSpacing: 1,
  },
  invoiceTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#1a5c38',
    textAlign: 'right',
  },
  invoiceMeta: {
    fontSize: 9,
    color: '#555',
    textAlign: 'right',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#1a5c38',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  section: {
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  label: {
    width: 100,
    fontFamily: 'Helvetica-Bold',
    color: '#555',
  },
  value: {
    flex: 1,
    color: '#0e1a12',
  },
  table: {
    marginBottom: 18,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a5c38',
    padding: '6 8',
    borderRadius: 3,
    marginBottom: 2,
  },
  tableHeaderText: {
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    padding: '5 8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableRowAlt: {
    backgroundColor: '#f9f9f6',
  },
  col: {
    flex: 1,
  },
  colWide: {
    flex: 3,
  },
  colRight: {
    flex: 1,
    textAlign: 'right',
  },
  summaryBox: {
    marginLeft: 'auto',
    width: 200,
    marginBottom: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderTopWidth: 2,
    borderTopColor: '#1a5c38',
    marginTop: 2,
  },
  summaryTotalText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: '#1a5c38',
  },
  paymentBox: {
    backgroundColor: '#f5f2eb',
    padding: 10,
    borderRadius: 4,
    marginBottom: 18,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    textAlign: 'center',
    color: '#888',
    fontSize: 8,
  },
  footerBrand: {
    fontFamily: 'Helvetica-Bold',
    color: '#1a5c38',
    fontSize: 9,
    marginBottom: 3,
  },
  badge: {
    backgroundColor: '#c9f230',
    color: '#0e1a12',
    fontSize: 8,
    padding: '2 6',
    borderRadius: 3,
    fontFamily: 'Helvetica-Bold',
    alignSelf: 'flex-start',
  },
});

const paymentLabels = {
  bkash: 'bKash',
  nagad: 'Nagad',
  rocket: 'Rocket',
  cod: 'Cash on Delivery',
};

function formatAmt(amount) {
  const num = Number(amount) || 0;
  return `\u09F3${num.toLocaleString('en-BD')}`;
}

function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Invoice({ order }) {
  if (!order) return null;

  const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items ?? [];
  const subtotal = Number(order.subtotal) || 0;
  const discount = Number(order.discount) || 0;
  const deliveryFee = Number(order.delivery_fee) || 0;
  const total = Number(order.total) || subtotal - discount + deliveryFee;

  return (
    <Document title={`Invoice ${order.order_number}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>ALTRO</Text>
            <Text style={styles.brandTagline}>QUALITY ATTIRE · BANGLADESH</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceMeta}>Order #: {order.order_number}</Text>
            <Text style={styles.invoiceMeta}>Date: {formatDate(order.created_at)}</Text>
            {order.status && (
              <View style={{ alignItems: 'flex-end', marginTop: 4 }}>
                <Text style={styles.badge}>{order.status.toUpperCase().replace(/_/g, ' ')}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill To</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{order.customer_name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{order.customer_phone}</Text>
          </View>
          {order.customer_email && (
            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{order.customer_email}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{order.customer_address}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>District:</Text>
            <Text style={styles.value}>
              {order.district === 'dhaka' ? 'Dhaka' : 'Outside Dhaka'}
            </Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colWide]}>Product</Text>
            <Text style={[styles.tableHeaderText, styles.col]}>Color</Text>
            <Text style={[styles.tableHeaderText, styles.col]}>Size</Text>
            <Text style={[styles.tableHeaderText, styles.col, { textAlign: 'center' }]}>Qty</Text>
            <Text style={[styles.tableHeaderText, styles.colRight]}>Unit Price</Text>
            <Text style={[styles.tableHeaderText, styles.colRight]}>Total</Text>
          </View>
          {items.map((item, idx) => {
            const unitPrice = item.sale_price ?? item.price ?? 0;
            const lineTotal = unitPrice * (item.qty ?? 1);
            return (
              <View
                key={item.id ?? idx}
                style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}
              >
                <Text style={[styles.col, styles.colWide]}>{item.name}</Text>
                <Text style={styles.col}>{item.color || '—'}</Text>
                <Text style={styles.col}>{item.size || '—'}</Text>
                <Text style={[styles.col, { textAlign: 'center' }]}>{item.qty}</Text>
                <Text style={styles.colRight}>{formatAmt(unitPrice)}</Text>
                <Text style={styles.colRight}>{formatAmt(lineTotal)}</Text>
              </View>
            );
          })}
        </View>

        {/* Summary */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text>Subtotal</Text>
            <Text>{formatAmt(subtotal)}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.summaryRow}>
              <Text>Discount{order.coupon_code ? ` (${order.coupon_code})` : ''}</Text>
              <Text style={{ color: '#c00' }}>-{formatAmt(discount)}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text>Delivery Fee</Text>
            <Text>{deliveryFee === 0 ? 'Free' : formatAmt(deliveryFee)}</Text>
          </View>
          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalText}>Total</Text>
            <Text style={styles.summaryTotalText}>{formatAmt(total)}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentBox}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Method:</Text>
            <Text style={styles.value}>
              {paymentLabels[order.payment_method] ?? order.payment_method}
            </Text>
          </View>
          {order.payment_sender_number && (
            <View style={styles.row}>
              <Text style={styles.label}>Sender No.:</Text>
              <Text style={styles.value}>{order.payment_sender_number}</Text>
            </View>
          )}
          {order.payment_trx_id && (
            <View style={styles.row}>
              <Text style={styles.label}>Transaction ID:</Text>
              <Text style={styles.value}>{order.payment_trx_id}</Text>
            </View>
          )}
          {order.payment_note && (
            <View style={styles.row}>
              <Text style={styles.label}>Note:</Text>
              <Text style={styles.value}>{order.payment_note}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>ALTRO — Quality Attire from Bangladesh</Text>
          <Text>Thank you for your order! We appreciate your business.</Text>
          <Text>For support, please contact us with your order number.</Text>
        </View>
      </Page>
    </Document>
  );
}

export function InvoiceDownloadButton({ order }) {
  if (!order) return null;
  const fileName = `altro-invoice-${order.order_number ?? 'order'}.pdf`;
  return (
    <PDFDownloadLink document={<Invoice order={order} />} fileName={fileName}>
      {({ loading }) => (
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1a5c38] text-white font-semibold hover:bg-[#2a7d50] transition-colors disabled:opacity-60"
          disabled={loading}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          {loading ? 'Preparing PDF…' : 'Download Invoice'}
        </button>
      )}
    </PDFDownloadLink>
  );
}
