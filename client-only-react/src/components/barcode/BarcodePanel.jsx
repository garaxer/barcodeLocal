import React from 'react';
import { connect } from 'react-redux';

import BarcodeList from './BarcodeListWrapper';

const BarcodePanel = () => {
  return (
    <div>
      <BarcodeList />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {})(BarcodePanel);
