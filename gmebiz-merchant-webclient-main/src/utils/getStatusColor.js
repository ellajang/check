
export default function getStatusColor(status) {
  switch (status?.toUpperCase()) {
    case "APPROVED":
    case "PAID":
    case "ACTIVE":
    case "ACCEPTED":
    case "DEPOSITED":
      return {color: "success.main", bgColor: 'success.light', icon:'tabler:square-check'};
    case "REJECTED":
    case "SUSPENDED":
    case "EXPIRED":
    case "DELETED":
    case "LOCKED":
      return {color: "text.red", bgColor: 'danger.light', icon:'tabler:ban'};
    default:
      return {color: "text.yellow", bgColor: 'text.yellowLight', icon:'tabler:loader'};
  }
}
