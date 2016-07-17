-- Create the class
local notifications = class({})

function notifications:send(ply, data)
	print(data)
end

-- Define the export
return notifications()
