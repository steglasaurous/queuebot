using System;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

public class CPHInline
{

	// FIXME: ATCD Sync puts everything in its own directory, so might want to take that into account when determining where to put files.
	public static string audioTripDownloadPath = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData).Replace("Roaming","LocalLow") + "\\Kinemotik Studios\\Audio Trip\\Songs";
	public static string spinRhythmXdDownloadPath = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData).Replace("Roaming","LocalLow") + "\\Super Spin Digital\\Spin Rhythm XD\\Custom";
	//public static string spinRhythmXdDownloadPath = "C:\\Users\\subpa\\test";

	public bool Execute()
	{
		// FIXME: Future improvement: If it's a queue message, loop through the list of song requests and see what
		//        needs downloading.
		var incomingEvent = JObject.Parse(args["message"].ToString());

		if ((string)incomingEvent["event"] == "songRequestAdded") {
			// Pull out what we need to check downloads.
			CPH.LogDebug("Downloading file: " + (string)incomingEvent["data"]["song"]["downloadUrl"]);
			ProcessSongRequest((string)incomingEvent["data"]["song"]["downloadUrl"], (string)incomingEvent["data"]["song"]["gameName"]);
		}
		return true;
	}

	public void ProcessSongRequest(string downloadUrl, string gameName) {
		string destinationPath = "";

		switch (gameName) {
			case "spin_rhythm":
				destinationPath = CPHInline.spinRhythmXdDownloadPath;
				break;
			case "audio_trip":
				destinationPath = CPHInline.audioTripDownloadPath;
				break;
		}

		// First run: Just download, every time.  We'll add checking for whether we need to download later.
		// Check to see if the map is already present?
		string tmpFilePath = "";
		using (var client = new HttpClient())
		{
			try
			{
				using (var response = client.GetAsync(downloadUrl))
				{
					// FIXME: I wonder if this is necessary now?  Unless we get files other than zip files.
					tmpFilePath = Path.GetTempPath() + "\\" + response.Result.Content.Headers.ContentDisposition.FileName.Replace("\"","").Replace("\\", "");
					CPH.LogDebug(tmpFilePath);
					using (var s = response.Result.Content.ReadAsStreamAsync())
					{
						using (var fs = new FileStream(tmpFilePath, FileMode.OpenOrCreate))
						{
							s.Result.CopyTo(fs);
						}
					}
				}
			} catch (HttpRequestException e)
			{
				CPH.LogInfo("Downloading song failed: " + e.Message);
			}
		}
		if (File.Exists(tmpFilePath)) {
			CPH.LogDebug("Extracting to " + destinationPath);
			System.IO.Compression.ZipFile.ExtractToDirectory(tmpFilePath, destinationPath);

			// Remove zip file.
			CPH.LogDebug("Removing original zip file");
			File.Delete(tmpFilePath);
		}
	}
}
