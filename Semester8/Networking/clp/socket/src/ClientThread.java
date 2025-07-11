import java.io.*;
import java.net.*;
import java.util.Scanner;

public class ClientThread {
    public static void main(String[] args) {
        try {
            // Connect to the server on localhost at port 5000
            Socket clientsocket = new Socket("localhost", 5001);

            System.out.println("Connected to the server at Handshaking Port: " + clientsocket.getPort());
            System.out.println("Client is communicating via Local Port: " + clientsocket.getLocalPort());
            System.out.println("Client is Connected");

            // Create input and output streams
            Scanner scn = new Scanner(System.in);
            DataOutputStream dos = new DataOutputStream(clientsocket.getOutputStream());
            DataInputStream dis = new DataInputStream(clientsocket.getInputStream());

            while (true) {
                // Receive and print the message from the server
                String inLine = dis.readUTF();
                System.out.println(inLine);

                // Take user input and send it to the server
                String outLine = scn.nextLine();
                dos.writeUTF(outLine);

                // Handle exit condition
                if (outLine.equalsIgnoreCase("Exit")) {
                    System.out.println("Closing the connection: " + clientsocket);
                    System.out.println("Connection Closed");
                    break;
                }

                // Receive and print the server's response
                String received = dis.readUTF();
                System.out.println(received);
            }

            // Close resources
            dos.close();
            dis.close();
            clientsocket.close();
        } catch (Exception ex) {
            System.out.println("An error occurred: " + ex.getMessage());
        }
    }
}
