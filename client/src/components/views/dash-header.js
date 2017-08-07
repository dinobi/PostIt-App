import React from 'react';

class HeaderNav extends React.Component {
    render() {
      return (
        <header className="dashboard-header">
			<nav className="amber">
				<div className="nav-wrapper">
					<a href="index.html" className="dashboard-logo">
						<img src="https://github.com/dinobi/Bootcamp-LOS-24-POSTIT/blob/master/client/src/images/postit-logo.png" alt="postit-logo"/></a>
					<a icon-label="mobile-menu" class="nav-mobile">
						<span></span>
						<span></span>
						<span></span>
					</a>
					<ul className="nav-list right hide-on-med-and-down">
						<li className="nav-item"><a href="#more"><i className="material-icons">more_vert</i></a></li>
						<li className="nav-item"><a href="#create-group"><button className="btn btn-create">Create a new group</button></a></li>
					</ul>
				</div>
				<div className="mobile-nav">
					<div className="container" id="mobile-nav"></div>					
				</div>
			</nav>
		</header>
      );
    }
}

export default DashHeader;

