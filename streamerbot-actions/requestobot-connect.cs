using System;

public class CPHInline
{
	public bool Execute()
	{
		// We emit a subscribe message to the websocket server.
		CPH.WebsocketSend("{ \"event\": \"subscribe\", \"data\": { \"channelName\": \"" + args["channelName"].ToString() + "\" } }", Convert.ToInt32(args["wsIdx"]));

		return true;
	}
}
