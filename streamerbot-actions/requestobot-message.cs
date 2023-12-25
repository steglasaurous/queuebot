using System;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

public class CPHInline
{

	public static string audioTripDownloadPath = "";
	// FIXME: Set default but allow override if it's in the args.
	public static string spinRhythmXdDownloadPath = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData).Replace("Roaming","LocalLow") + "\\Super Spin Digital\\Spin Rhythm XD\\Custom";
	public bool Execute()
	{
		var incomingEvent = JObject.Parse(args["message"].ToString());

		if ((string)incomingEvent["event"] == "songRequestAdded") {
			ProcessSongRequest(
				(string)incomingEvent["data"]["song"]["downloadUrl"],
				(string)incomingEvent["data"]["song"]["gameName"],
				(string)incomingEvent["data"]["song"]["fileReference"]
			);
		}
		return true;
	}

	public void ProcessSongRequest(string downloadUrl, string gameName, string fileReference) {
		if (gameName == "spin_rhythm") {
			CPH.LogDebug("downloadUrl: " + downloadUrl + " gameName: " + gameName + " fileReference: " + fileReference);

			if (File.Exists(spinRhythmXdDownloadPath + "\\" + fileReference + ".srtb")) {
				CPH.LogDebug(fileReference + " already downloaded.");
				return;
			}

			string tempFilePath = Path.GetTempPath() + "\\" + fileReference + ".zip";
			if (File.Exists(tempFilePath)) {
				File.Delete(tempFilePath);
				CPH.LogDebug("Deleted temp file at " + tempFilePath);
			}
			CPH.LogDebug("Downloading " + fileReference + " from " + downloadUrl + " to " + tempFilePath);

			using (var client = new HttpClient())
			{
				using (var s = client.GetStreamAsync(downloadUrl))
				{
					using (var fs = new FileStream(tempFilePath, FileMode.OpenOrCreate))
					{
						s.Result.CopyTo(fs);
					}
				}
			}
			CPH.LogDebug("Extracting to " + CPHInline.spinRhythmXdDownloadPath);
			System.IO.Compression.ZipFile.ExtractToDirectory(tempFilePath, CPHInline.spinRhythmXdDownloadPath);
			File.Delete(tempFilePath);
			CPH.LogDebug("Deleted temp file at " + tempFilePath);
		}
	}
}
