 //variables
        var totalWidth = window.innerWidth;
        var totalHeight = window.innerHeight;
        var boardHeight = 93 + 20;
        var boardWidth = 324 + 20;
        var ballHeight = 68;
        var ballWidth = 68;
        var startPlace = totalHeight - boardHeight ;
        var board, ball, timeLabel, speedLabel,infoLabel;
        var divLost;
        var direction = 'rd';
        var playTime = 0;
	var actualSpeed = 0;
        var newPaddingValue = 0;
        var newPaddingTop = 0;
        var newPaddingLeft = 0;
        var yPositionBallBottomEdge= 0;;
        var yPositionBallTopEdge= 0;;
        var xPositionBallRightEdge= 0;;
        var xPositionBallLeftEdge= 0;;
        var yPositionBoardTopEdge= 0;;      
        var xPositionBoardLeftEdge = 0;
        var xPositionBoardRightEdge = 0;
        
        //event
        document.onkeypress = keyPressed;
        
        //interval
        var moveBallInterval = window.setInterval(moveBall,50);
        var incrementPlayTimeInterval = window.setInterval(incrementPlayTime, 1000);
	var incrementSpeedInterval = window.setInterval(incrementSpeed, 3000);
       
        //enum Direction
        var DIRECTION = {
            rightDown : 'rd', 
            leftDown : 'ld',
            leftUp : 'lu',
            rightUp : 'ru'
          };
        
        $(document).ready(
            function ()    
                {
                    setGlobalVariable();
                    setPostionAbsolute();
                    setBoardPosition();
                }     
            );
        
        function setGlobalVariable(){
            board = $("#board"); 
            ball = $("#ball"); 
            timeLabel = $("#TimeLabel");
            speedLabel = $("#SpeedLabel");
            infoLabel = $("#InfoLabel");
        }
        
        function setPostionAbsolute(){
            board.css('position','absolute');
            ball.css('position','absolute');
            timeLabel.css('position','absolute');
            speedLabel.css('position','absolute');
            speedLabel.css("margin-top","30px");
            infoLabel.css("margin-top","60px");
            infoLabel.css('position','absolute');
        }
        
        function setBoardPosition(){
            board.css("padding-top",startPlace);
        }
        
        function keyPressed(event) {
          switch(event.code)
          {
            case 'ArrowRight':
                moveRightF();
                break;
            case 'ArrowLeft':
                moveLeftF();
                break;
            case 'KeyP':
                pauseGame();
                break;
            case 'KeyS':
                resumeGame();
                break;
          }
        };
        
        function pauseGame(){
            window.clearInterval(moveBallInterval);
            window.clearInterval(incrementPlayTimeInterval);
            window.clearInterval(incrementSpeedInterval);
        }
        
        function resumeGame(){
            moveBallInterval = window.setInterval(moveBall,50);
            incrementPlayTimeInterval = window.setInterval(incrementPlayTime, 1000);
            incrementSpeedInterval = window.setInterval(incrementSpeed, 3000);
        }
        
        function moveRightF(){
            newPaddingValue = getCssPaddingAsInteger(board,"padding-left") + 10;
            if(newPaddingValue + boardWidth > totalWidth)
            {
                return;
            }
            board.css("padding-left",newPaddingValue);
        }
        
        function moveLeftF(){
            newPaddingValue = getCssPaddingAsInteger(board,"padding-left") - 10;
            if(newPaddingValue + boardWidth < 0)
            {
                return;
            }
            board.css("padding-left",newPaddingValue);
        }
        
        function moveBall()
        {
            try
            {
                var newDirection = detectCollision(direction);
            
                switch(newDirection)
                {
                    case 'lost':
                        {
                            alert('Koniec gry. Twoj czas to '+ getPlayTime() + " sekund");
                            resetPlayTime();
                            resetSpeed();
                            location.reload(); 
                            break; 
                        }
                    case 'rd':
                        moveBallRightDown();
                        break;
                    case 'ld':
                        moveBallLeftDown();
                        break;
                    case 'ru':
                        moveBallRightUp();
                        break;
                    case 'lu':
                        moveBallLeftUp();
                        break;
                }
            }
            catch(err)
            {
                alert(err);
            }
        }
        
        function moveBallRightDown()
        {
            direction = 'rd';
            newPaddingTop = getCssPaddingAsInteger(ball,"padding-top") + 10 + actualSpeed;           
            ball.css("padding-top",newPaddingTop);
            newPaddingLeft = getCssPaddingAsInteger(ball, "padding-left") + 10 + actualSpeed;         
            ball.css("padding-left",newPaddingLeft);
            console.log("moveBallRightDown");
        }
        
        function moveBallRightUp()
        {
            direction = 'ru';
            newPaddingTop = getCssPaddingAsInteger(ball,"padding-top") - 10 - actualSpeed;           
            ball.css("padding-top",getNonNegativeValue(newPaddingTop));
            newPaddingLeft = getCssPaddingAsInteger(ball,"padding-left") + 10 + actualSpeed;          
            ball.css("padding-left",newPaddingLeft);
            console.log("moveBallRightUp");
        }
        
        function moveBallLeftUp()
        {
            direction = 'lu';
            newPaddingTop = getCssPaddingAsInteger(ball,"padding-top") - 10 - actualSpeed;        
            ball.css("padding-top",getNonNegativeValue(newPaddingTop));
            newPaddingLeft = getCssPaddingAsInteger(ball,"padding-left") - 10 - actualSpeed;      
            ball.css("padding-left",getNonNegativeValue(newPaddingLeft));
             console.log("moveBallLeftUp");
        }
        
        function moveBallLeftDown()
        {
            direction = 'ld';
            newPaddingTop = getCssPaddingAsInteger(ball,"padding-top") + 10 + actualSpeed;    
            ball.css("padding-top",newPaddingTop);
            newPaddingLeft = getCssPaddingAsInteger(ball,"padding-left") - 10 - actualSpeed; 
            ball.css("padding-left",getNonNegativeValue(newPaddingLeft));
            console.log("moveBallLeftDown");
        }
        
        function detectCollision(oldDirection)
        {
            yPositionBallBottomEdge = getCssPaddingAsInteger(ball,"padding-top") + ballHeight; 
            yPositionBallTopEdge = getCssPaddingAsInteger(ball,"padding-top");                 
            xPositionBallRightEdge = getCssPaddingAsInteger(ball,"padding-left")+ ballWidth;   
            xPositionBallLeftEdge = getCssPaddingAsInteger(ball,"padding-left");                
            
            yPositionBoardTopEdge = getCssPaddingAsInteger(board,"padding-top"); 
            
        //ball and window bottom edge
        if(yPositionBallBottomEdge > totalHeight)
            {
               return 'lost';
            }    
            //meeting of ball and board
            if( yPositionBallBottomEdge > yPositionBoardTopEdge )
            {   
                if(!isBallOnBoard(xPositionBallLeftEdge,xPositionBallRightEdge))
                {
                    return oldDirection;
                }
                if(direction=='rd')
                {
                    return 'ru';
                }
                if(direction=='ld')
                {
                    return 'lu';
                }
            }
            
            //BALL and top window edge
            if(yPositionBallTopEdge <= 0)
            {
                if(direction=='ru')
                {
                    return 'rd';
                }
                if(direction=='lu')
                {
                    return 'ld';
                }
            }
            
            //BALL and right wall
            if(xPositionBallRightEdge > totalWidth)
            {
                if(direction=='ru')
                {
                    return 'lu';
                }
                if(direction=='rd')
                {
                    return 'ld';
                }
            }
            
            //BALL and right wall
            if(xPositionBallLeftEdge <= 0)
            {
                if(direction=='lu')
                {
                    return 'ru';
                }
                if(direction=='ld')
                {
                    return 'rd';
                }
            }
            return oldDirection;
        }
        
        function isBallOnBoard(xPositionBallLeftEdge, xPositionBallRightEdge)
        {
            xPositionBoardLeftEdge = getCssPaddingAsInteger(board,"padding-left");                  
            xPositionBoardRightEdge = getCssPaddingAsInteger(board,"padding-left") + boardWidth;    
            if(((xPositionBallLeftEdge < xPositionBoardRightEdge) && (xPositionBallLeftEdge > xPositionBoardLeftEdge))  || ((xPositionBallRightEdge > xPositionBoardLeftEdge)&& (xPositionBallLeftEdge<xPositionBoardRightEdge)))
                return true;
            
            return false;
        }
        
        function getCssPaddingAsInteger(elementId,paddingType)
        {
            return Number(elementId.css(paddingType).replace('px',''));
        }
        
        function getNonNegativeValue(valueToCheck){
            if(valueToCheck < 0)
                return 0;
            
            return valueToCheck;
        }
        
        function incrementPlayTime()
        {   
            playTime += 1;
            setPlayTimeOnLabel();
        }
        
        function getPlayTime()
        {
            return playTime;
        }
        
        function resetPlayTime(){
            playTime = 0;    
            setPlayTimeOnLabel();
        }
        
        function setPlayTimeOnLabel(){
            TimeLabel.value = playTime + " sekund";
        }
        
        function incrementSpeed(){
            actualSpeed += 1;
            setSpeedOnLabel();
        }
        
         function resetSpeed(){
            actualSpeed = 0;
            setSpeedOnLabel();
        }
        
        function setSpeedOnLabel(){
            SpeedLabel.value = "Szybkosc: " + actualSpeed;
        }