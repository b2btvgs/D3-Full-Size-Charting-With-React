import React from 'react';
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import  { AcUnit } from '@material-ui/icons'

const useStyles = makeStyles( () => ({
  typographyStyles: {
    flex: 1,
    // fontSize: '0.7em'
  },
  header: {
    background: 'cornflowerblue',
    // height: '40px'
  },
  textSize: {
    // fontSize: '0.7em',

  }
}))

const Header = () => {

  const classes = useStyles();

  return (
    <div>
       <AppBar position="static">
         <Toolbar>
           <Typography className={classes.typographyStyles}>Cisco Metrics</Typography>
           <Button color="inherit">Login</Button>
           <AcUnit></AcUnit>
         </Toolbar>
       </AppBar>
     </div>
     
   )
}

export default Header;
