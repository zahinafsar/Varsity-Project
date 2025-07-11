import java.io.*;
import java.net.*;

public class ServerThread {
    public static void main(String args[]) throws IOException {
        ServerSocket handshake = new ServerSocket(5001);

        while (true) {
            Socket com_socket = handshake.accept();
            System.out.println("A new client is connected " + com_socket);

            DataOutputStream out = new DataOutputStream(com_socket.getOutputStream());
            DataInputStream in = new DataInputStream(com_socket.getInputStream());

            System.out.println("A new thread is assigning");
            Thread new_tunnel = new ClientHandler(com_socket, in, out);
            new_tunnel.start();
        }
    }
}
