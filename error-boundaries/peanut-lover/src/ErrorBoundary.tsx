import React, { ErrorInfo } from "react";

interface State {
  hasError: boolean;
}
interface Props {}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Record error
  }
  render() {
    if (this.state.hasError) {
      return <h1>Somthing went wrong</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
