using System;

public class CPHInline
{
	public bool Execute()
	{
		CPH.LogDebug("Executing connect thing");
		// We emit a subscribe message to the websocket server.
		CPH.WebsocketSend("{ \"event\": \"subscribe\", \"data\": { \"channelName\": \"" + args["channelName"].ToString() + "\" } }", 5);

		return true;
	}
}
