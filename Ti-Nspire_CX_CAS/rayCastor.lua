platform.apiLevel = '2.0'
require ('physics');

-- Useful values --
local screen = platform.window
local h=screen:height()
local w=screen:width()

-- Level data --
local mapSize = 10;
local level = {
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 3, 0, 0, 5, 1, 0, 1,
	1, 0, 0, 3, 0, 0, 0, 1, 0, 1,
	1, 0, 1, 0, 0, 0, 1, 4, 0, 1,
	1, 0, 2, 2, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 3, 1,
	1, 0, 0, 0, 0, 0, 0, 3, 3, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 3, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1
};
local mapColours = {{127, 127, 127}, {127, 30, 30}, {200, 170, 35}, {35, 64, 243}, {123, 255, 123}}

-- Parameters --
local tileSize = 20;
local raySpacing = 2;
local fov = 100;

-- Vectors and positions --
playerLocation = {};
playerRotation = physics.Vect(-1, 3);
playerLocation["x"] = 100;
playerLocation["y"] = 100;
playerRotation = playerRotation.normalize(playerRotation)

-- Functions for the algorithm --
function tileAt(x, y) 
	return level[math.floor(y / tileSize) * mapSize + math.floor(x / tileSize) + 1];
end

function getRayLength(object1, object2) 
	local differenceX = object1.x - object2.x;
	local differenceY = object1.y - object2.y;
	return math.sqrt(differenceX * differenceX + differenceY * differenceY);
end

-- Actual rayCasting --
function on.paint(gc)
    -- Roof and Floor
    gc:setColorRGB(20, 40, 80)
    gc:fillRect(0, 0, w, h/2)
    
    gc:setColorRGB(20, 40, 37)
    gc:fillRect(0, h/2, w, h)
    
    -- ray shit idk --
    for angle = -(fov/2), fov/2, raySpacing do
        local radianAngle = angle*(3.14159/180);
        local currentRayDirection = playerRotation.rotate(playerRotation, physics.Vect(radianAngle));
        local currentRayEnd = {};
        currentRayEnd["x"] = playerLocation.x;
        currentRayEnd["y"] = playerLocation.y;
        
        local xDirection = currentRayDirection.x(currentRayDirection);
        local yDirection = currentRayDirection.y(currentRayDirection);
        while(tileAt(currentRayEnd.x, currentRayEnd.y) == 0) do
            currentRayEnd.x = currentRayEnd.x + xDirection;
            currentRayEnd.y = currentRayEnd.y + yDirection;
        end

        local rayLength = getRayLength(playerLocation, currentRayEnd);

        -- Debug Rendering --
--		local x1 = playerLocation.x;
--		local y1 = playerLocation.y;
--		local x2 = currentRayEnd.x;
--		local y2 = currentRayEnd.y;
--
--		gc:drawLine(x1, y1, x2, y2);
--		gc:fillRect(playerLocation.x - 5, playerLocation.y - 5, 10, 10)
--		
--		for y = 0, 200, tileSize
--        do
--            for x = 0, 199, tileSize
--            do
--                if tileAt(x, y) == 1
--                then
--                    gc:fillRect(x, y, 19, 19)
--                end
--                x = x + 1
--            end
--            y = y + 1
--        end
		
        local hitTile = tileAt(currentRayEnd.x, currentRayEnd.y)
        if (hitTile ~= 0 and hitTile ~= nil) then
            local rw = w / (fov / raySpacing) + 1;
            local rh = 15*h / (rayLength * math.cos(angle*(3.14159/180)))
            local x = ((angle + (fov/2))/fov)*w
            local y = (h-rh)/2
            
            local currentColour = mapColours[hitTile]
            if (tileAt(currentRayEnd.x, currentRayEnd.y + 1) == 0 or tileAt(currentRayEnd.x, currentRayEnd.y - 1) == 0) then
                gc:setColorRGB((currentColour[1] - 30), (currentColour[2] - 30), (currentColour[3] - 30))
--                print("wat the hell")
            else
                gc:setColorRGB(currentColour[1], currentColour[2], currentColour[3])
            end
            
            gc:fillRect(x, y, rw, rh)
        end
        angle = angle + raySpacing
    end
    timer.start(0.01)
end

function on.arrowLeft()
    local angle = math.cos(playerRotation.x(playerRotation))
    playerRotation = playerRotation.rotate(playerRotation, physics.Vect(-angle/3))
end
function on.arrowRight()
    local angle = math.cos(playerRotation.x(playerRotation))
    playerRotation = playerRotation.rotate(playerRotation, physics.Vect(angle/3))
end
function on.arrowDown()
    playerLocation.x = playerLocation.x - playerRotation.x(playerRotation)*2
    playerLocation.y = playerLocation.y - playerRotation.y(playerRotation)*2
end
function on.arrowUp()
    playerLocation.x = playerLocation.x + playerRotation.x(playerRotation)*2
    playerLocation.y = playerLocation.y + playerRotation.y(playerRotation)*2
end
function on.timer()
	timer.stop()
	platform.window:invalidate()
end