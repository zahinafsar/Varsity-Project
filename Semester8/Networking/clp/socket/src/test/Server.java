import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

public class Server {
    public static void main(String[] args) throws IOException {
        ServerSocket conn = new ServerSocket(5002);

        while (true) {
            Socket handshake = conn.accept();
            DataOutputStream out = new DataOutputStream(handshake.getOutputStream());
            DataInputStream in = new DataInputStream(handshake.getInputStream());
            Thread handler = new Handler(handshake, in, out);
            handler.start();
        }
    }
}
