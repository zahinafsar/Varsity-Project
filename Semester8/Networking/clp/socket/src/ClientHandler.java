import java.io.*;
import java.net.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

class ClientHandler extends Thread {
    private final DateFormat fordate = new SimpleDateFormat("yyyy/MM/dd");
    private final DateFormat fortime = new SimpleDateFormat("hh:mm:ss");
    private final Socket com_tunnel;
    private final DataInputStream dis_tunnel;
    private final DataOutputStream dos_tunnel;

    public ClientHandler(Socket s, DataInputStream dis, DataOutputStream dos) {
        this.com_tunnel = s;
        this.dis_tunnel = dis;
        this.dos_tunnel = dos;
    }

    @Override
    public void run() {
        String received;
        String toreturn;

        while (true) {
            try {
                // Prompt the client for input
                dos_tunnel.writeUTF("What do you want [Date/Time]");

                // Read the client's response
                received = dis_tunnel.readUTF();

                // Handle exit condition
                if (received.equalsIgnoreCase("Exit")) {
                    System.out.println("Client " + this.com_tunnel + " sends exit.");
                    System.out.println("Closing the connection.");
                    this.com_tunnel.close();
                    break;
                }

                // Process the client's request
                Date date = new Date();
                switch (received) {
                    case "Date":
                        toreturn = fordate.format(date);
                        dos_tunnel.writeUTF(toreturn);
                        break;

                    case "Time":
                        toreturn = fortime.format(date);
                        dos_tunnel.writeUTF(toreturn);
                        break;

                    default:
                        dos_tunnel.writeUTF("Invalid input");
                        break;
                }
            } catch (IOException ex) {
                Logger.getLogger(ClientHandler.class.getName()).log(Level.SEVERE, null, ex);
                break;
            }
        }

        // Close resources after exiting the loop
        try {
            this.dos_tunnel.close();
            this.dis_tunnel.close();
        } catch (IOException ex) {
            Logger.getLogger(ClientHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
