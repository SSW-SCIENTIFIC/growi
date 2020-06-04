import React from 'react';
import PropTypes from 'prop-types';
import loggerFactory from '@alias/logger';
import {
  Modal, ModalBody,
} from 'reactstrap';
import contributors from './Contributor';

/**
 * Page staff credit component
 *
 * @export
 * @class StaffCredit
 * @extends {React.Component}
 */


export default class StaffCredit extends React.Component {

  constructor(props) {

    super(props);
    this.logger = loggerFactory('growi:StaffCredit');
    // px / sec
    const scrollSpeed = 200;
    const target = $('.credit-curtain');
    const scrollTargetHeight = target.children().innerHeight();
    const duration = scrollTargetHeight / scrollSpeed * 1000;
    target.animate({ scrollTop: scrollTargetHeight }, duration, 'linear');
    target.slimScroll({
      height: target.innerHeight(),
      // Able to scroll after automatic schooling is complete so set "bottom" to allow scrolling from the bottom.
      start: 'bottom',
      color: '#FFFFFF',
    });

  }

  // when this is called it returns the hotkey stroke
  getHotkeyStroke() {
    return ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  }

  renderMembers(memberGroup, keyPrefix) {
    // construct members elements
    const members = memberGroup.members.map((member) => {
      return (
        <div className={memberGroup.additionalClass} key={`${keyPrefix}-${member.name}-container`}>
          <span className="dev-position" key={`${keyPrefix}-${member.name}-position`}>
            {/* position or '&nbsp;' */}
            { member.position || '\u00A0' }
          </span>
          <p className="dev-name" key={`${keyPrefix}-${member.name}`}>{member.name}</p>
        </div>
      );
    });
    return (
      <React.Fragment key={`${keyPrefix}-fragment`}>
        {members}
      </React.Fragment>
    );
  }

  renderContributors() {
    const credit = contributors.map((contributor) => {
      // construct members elements
      const memberGroups = contributor.memberGroups.map((memberGroup, idx) => {
        return this.renderMembers(memberGroup, `${contributor.sectionName}-group${idx}`);
      });
      return (
        <React.Fragment key={`${contributor.sectionName}-fragment`}>
          <div className={`row ${contributor.additionalClass}`} key={`${contributor.sectionName}-row`}>
            <h2 className="col-md-12 dev-team staff-credit-mt-10rem staff-credit-mb-6rem" key={contributor.sectionName}>{contributor.sectionName}</h2>
            {memberGroups}
          </div>
          <div className="clearfix"></div>
        </React.Fragment>
      );
    });
    return (
      <div className="text-center staff-credit-content" onClick={this.props.toDelete}>
        <h1 className="staff-credit-mb-6rem">GROWI Contributors</h1>
        <div className="clearfix"></div>
        {credit}
      </div>
    );
  }

  render() {
    return (
      <Modal isOpen toggle={this.props.toDelete} scrollable className="staff-credit">
        <ModalBody className="credit-curtain">
          {this.renderContributors()}
        </ModalBody>
      </Modal>
    );
  }

}

StaffCredit.propTypes = {
  toDelete: PropTypes.func.isRequired,
};
